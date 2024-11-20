// app/services/api.ts
import { mockAuthApi } from './mockApi';
import { HUGGING_FACE_API_KEY } from '@env';


export { HUGGING_FACE_API_KEY };

export const authApi = mockAuthApi;

// When ready to switch to real auth, uncomment this:
/*
export const api = axios.create({
  baseURL: Config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },
  logout: async () => {
    await api.post('/auth/logout');
  },
};
*/