import axios from 'axios';

// Use Vite environment variable, fallback to localhost:5000 for local dev if not set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const customer = localStorage.getItem('customerToken');
    const staff = localStorage.getItem('staffToken');
    if (customer) {
        config.headers.Authorization = `Token ${customer}`;
    } else if (staff) {
        config.headers.Authorization = `Token ${staff}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('staffToken');
            localStorage.removeItem('staffUser');
            window.location.href = '#/login';
        }
        return Promise.reject(error);
    }
);

export default api;
export { API_BASE_URL };
