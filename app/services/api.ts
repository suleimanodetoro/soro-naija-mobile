// // app/services/api.ts
import { mockAuthApi } from './mockApi';

// Export the mock API for now
export const authApi = mockAuthApi;
// import axios from 'axios';
// import Config from '../config';
// import { useAuthStore } from '../store/auth';

// export const api = axios.create({
//   baseURL: Config.apiUrl,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add auth token to requests
// api.interceptors.request.use((config) => {
//   const token = useAuthStore.getState().token;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Handle auth errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       useAuthStore.getState().logout();
//     }
//     return Promise.reject(error);
//   }
// );

// export const authApi = {
//   login: async (email: string, password: string) => {
//     const response = await api.post('/auth/login', { email, password });
//     return response.data;
//   },
//   register: async (email: string, password: string, name: string) => {
//     const response = await api.post('/auth/register', { email, password, name });
//     return response.data;
//   },
//   logout: async () => {
//     await api.post('/auth/logout');
//   },
// };