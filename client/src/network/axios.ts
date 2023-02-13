import axios from 'axios';

export const ApiConnector = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    Authorization: localStorage.getItem('auth-code') || '',
  },
});
