import api from "../api/axios";

export const wishlistService = {
  get: () => api.get("/wishlist").then((r) => r.data),
  toggle: (productId) => api.post("/wishlist/toggle", { productId }).then((r) => r.data),
};
