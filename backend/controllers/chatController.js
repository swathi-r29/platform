const Chat = require('../models/Chat');
const Booking = require('../models/Booking');

const getChatByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isParticipant = booking.user.toString() === req.user._id.toString() || 
                          booking.worker.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    let chat = await Chat.findOne({ booking: bookingId })
      .populate('participants', 'name profileImage')
      .populate('messages.sender', 'name profileImage');

    if (!chat) {
      chat = await Chat.create({
        booking: bookingId,
        participants: [booking.user, booking.worker],
        messages: []
      });
      chat = await Chat.findById(chat._id)
        .populate('participants', 'name profileImage')
        .populate('messages.sender', 'name profileImage');
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { content, type, imageUrl, location } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isParticipant = booking.user.toString() === req.user._id.toString() || 
                          booking.worker.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    let chat = await Chat.findOne({ booking: bookingId });

    const message = {
      sender: req.user._id,
      content,
      type: type || 'text',
      imageUrl,
      location,
      isRead: false
    };

    chat.messages.push(message);
    chat.lastMessage = content;
    chat.lastMessageTime = new Date();
    await chat.save();

    chat = await Chat.findById(chat._id)
      .populate('participants', 'name profileImage')
      .populate('messages.sender', 'name profileImage');

    const io = req.app.get('io');
    io.to(bookingId).emit('newMessage', {
      chatId: chat._id,
      message: chat.messages[chat.messages.length - 1]
    });

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markMessagesAsRead = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const chat = await Chat.findOne({ booking: bookingId });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    chat.messages.forEach(msg => {
      if (msg.sender.toString() !== req.user._id.toString()) {
        msg.isRead = true;
      }
    });

    await chat.save();
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate('booking', 'service scheduledDate status')
      .populate('participants', 'name profileImage')
      .sort('-lastMessageTime');

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getChatByBooking,
  sendMessage,
  markMessagesAsRead,
  getUserChats
};