/// <reference types="vite/client" />

import axios from 'axios';
import toast from 'react-hot-toast';
import { authUrls } from './urls';

export const publicGateway = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL as string,
  headers: {
    'ngrok-skip-browser-warning': '69420',
    'Content-Type': 'application/json',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    Product: 'CustomerX',
    'Accept-Language': navigator.language,
  },
});

publicGateway.interceptors.request.use(
  function (config) {
    if (config.url) {
      if (!config.url.endsWith('/') && !config.url.includes('?')) {
        config.url += '/';
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export const privateGateway = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL as string,
  headers: {
    'ngrok-skip-browser-warning': '69420',
    'Content-Type': 'application/json',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    Product: 'CustomerX',
    'Accept-Language': navigator.language,
  },
});

privateGateway.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    if (config.url) {
      if (!config.url.endsWith('/') && !config.url.includes('?')) {
        config.url += '/';
      }
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

privateGateway.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error.response?.data?.statusCode === 1000) {
      try {
        const response = await publicGateway.post(authUrls.getAccessToken, {
          refresh_token: localStorage.getItem('refreshToken'),
        });
        const newAccessToken = response.data.response.access_token;
        localStorage.setItem('accessToken', newAccessToken);
        const { config } = error;
        config.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return await privateGateway.request(config);
      } catch (error_2) {
        toast.error('Your session has expired. Please login again.');
        setTimeout(() => {
          localStorage.clear();
          window.location.href = '/';
        }, 3000);
        return await Promise.reject(error_2);
      }
    } else {
      return await Promise.reject(error);
    }
  },
);