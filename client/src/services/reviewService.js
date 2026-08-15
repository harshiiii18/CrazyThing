import api from "../api/axios";

export const reviewService = {
  create: (payload) => api.post("/reviews", payload).then((r) => r.data),
  getForProduct: (productId) => api.get(`/reviews/product/${productId}`).then((r) => r.data),
  getForOrder: (orderId) => api.get(`/reviews/order/${orderId}`).then((r) => r.data),
};