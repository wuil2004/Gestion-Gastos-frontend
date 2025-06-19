import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Asegúrate que coincida con tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Enviando petición a:', config.url); 
  return config;
}, (error) => {
  console.error('Error en la petición:', error);
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  console.log('Respuesta recibida de:', response.config.url);
  return response;
}, (error) => {
  console.error('Error en la respuesta:', error);
  return Promise.reject(error);
});

export default api;