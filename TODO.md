# TODO: Add Chat Option in Notifications for Worker-Admin Communication

## Backend Changes
- [x] Modify `backend/models/Chat.js` to make `booking` field optional
- [x] Update `backend/controllers/chatController.js` to add functions for direct user chats (getChatByUsers, sendMessageToUser)
- [x] Update `backend/routes/chatRoutes.js` to add routes for direct user chats

## Frontend Changes
- [x] Modify `frontend/src/components/common/Chat.jsx` to handle both booking and direct user chats
- [x] Update `frontend/src/components/common/Notifications.jsx` to add "Chat with Admin" button for workers

## Testing and Validation
- [x] Test chat functionality between worker and admin
- [x] Ensure proper authorization (only workers can chat with admin)
- [x] Verify error handling and UI updates
