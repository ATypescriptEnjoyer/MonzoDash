import { Axios } from 'axios';

export const ApiConnector = new Axios({ baseURL: process.env.REACT_APP_API_URL || '' });

ApiConnector.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

    response.data = JSON.parse(response.data);

    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  },
);
