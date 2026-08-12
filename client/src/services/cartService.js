import api from "../api/axios";

export const cartService = {
  get: () => api.get("/cart").then((r) => r.data),
  addItem: (productId, quantity = 1) =>
    api.post("/cart/items", { productId, quantity }).then((r) => r.data),
  updateItem: (productId, quantity) =>
    api.put(`/cart/items/${productId}`, { quantity }).then((r) => r.data),
  removeItem: (productId) => api.delete(`/cart/items/${productId}`).then((r) => r.data),
  clear: () => api.delete("/cart").then((r) => r.data),
};
