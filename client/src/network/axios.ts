import axios from 'axios';

export const ApiConnector = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  headers: {
    Authorization: localStorage.getItem('auth-code') || '',
  },
});
