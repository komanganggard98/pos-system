import axios from 'axios';

const api = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
  },
  withCredentials: true,
  withXSRFToken: true,
});

// Opsional: Otomatis arahkan ke login jika sesi habis (401/419)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 419) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
