import axios from 'axios';

const API_BASE =
'http://localhost/БИВТ-24-8_Петрова_Д.С._19_Корабль/backend/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

export const getProducts = () => api.get('/products');

export const updateProductStock = (id, inStock) =>
    api.patch(`/products/${id}/stock`, { inStock });

export const register = (userData) =>
    api.post('/register', userData);

export const login = (credentials) =>
    api.post('/login', credentials);

export const getUsers = () =>
    api.get('/users');

export const getUserById = (id) =>
    api.get(`/users/${id}`);

export const deleteUser = (id) =>
    api.delete(`/users/${id}`);

export default api;