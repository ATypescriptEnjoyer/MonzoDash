import { Axios } from 'axios';

export const ApiConnector = new Axios({ baseURL: process.env.REACT_APP_API_URL || '' });
