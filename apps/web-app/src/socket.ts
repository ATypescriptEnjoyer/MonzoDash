import { io } from 'socket.io-client';


export const socket = io({
  transports: ['websocket'],
  withCredentials: true,
  auth: {
    token: JSON.parse(localStorage.getItem('auth-code') || '{}') || '',
  },
  reconnection: false,
  autoConnect: false,
});