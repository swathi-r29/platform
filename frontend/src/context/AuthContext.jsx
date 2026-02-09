import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import io from 'socket.io-client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        // Initialize socket connection
        const newSocket = io('http://localhost:5000');
        newSocket.on('connect', () => {
          newSocket.emit('join', userData._id);
        });
        setSocket(newSocket);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const login = async (email, password, role) => {
    try {
      const endpoint = role === 'admin' ? '/auth/admin/login' : '/auth/login';
      const { data } = await axios.post(endpoint, { email, password });
      
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      
      if (data.role === 'admin') navigate('/admin/dashboard');
      else if (data.role === 'worker') navigate('/worker/dashboard');
      else navigate('/user/dashboard');
      
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      throw message;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await axios.post('/auth/register', userData);
      
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      
      if (data.role === 'worker') navigate('/worker/dashboard');
      else navigate('/user/dashboard');
      
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      throw message;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, socket }}>
      {children}
    </AuthContext.Provider>
  );
};