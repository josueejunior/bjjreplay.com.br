import axios from 'axios';

export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== 'false';

// Com mocks ativos as requisições usam paths relativos (/api/...) para o MSW
// interceptar no browser. Com API real, aponta para o FastAPI.
const baseURL = USE_MOCKS
  ? ''
  : process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
