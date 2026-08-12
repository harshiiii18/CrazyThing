import api from "../api/axios";

export const productService = {
  list: (params) => api.get("/products", { params }).then((r) => r.data),
  getById: (id) => api.get(`/products/${id}`).then((r) => r.data),
  create: (payload) => api.post("/products", payload).then((r) => r.data),
  update: (id, payload) => api.put(`/products/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/products/${id}`).then((r) => r.data),
  aiAssist: (payload) => api.post("/ai/listing-assist", payload).then((r) => r.data),
  search: (query) => api.get("/ai/search", { params: { q: query } }).then((r) => r.data),
};
