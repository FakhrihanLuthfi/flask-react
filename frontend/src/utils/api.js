import axios from "axios";

const API_URL = "https://4w6n9z0k-8000.asse.devtunnels.ms";

// ==================
// PRODUCTS
// ==================
export const getProducts = () => axios.get(`${API_URL}/products`);

export const addProduct = (product) =>
  axios.post(`${API_URL}/products`, product, {
    headers: { "Content-Type": "application/json" },
  });

// ==================
// CART
// ==================
export const getCart = () => axios.get(`${API_URL}/cart`);

export const addToCart = (id) =>
  axios.post(`${API_URL}/cart/${id}`, null, {
    headers: { "Content-Type": "application/json" },
  });

export const removeFromCart = (id) =>
  axios.delete(`${API_URL}/cart/${id}`);
