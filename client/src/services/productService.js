import api from "../api/axios";

export const productService = {
  list: (params) => api.get("/products", { params }).then((r) => r.data),
  getById: (id) => api.get(`/products/${id}`).then((r) => r.data),
  create: (payload) => api.post("/products", payload).then((r) => r.data),
  update: (id, payload) => api.put(`/products/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/products/${id}`).then((r) => r.data),
  updateStatus: (id, status) => api.patch(`/products/${id}/status`, { status }).then((r) => r.data),
  mine: () => api.get("/products/mine").then((r) => r.data),
  getSellerContact: (id) => api.get(`/products/${id}/contact-seller`).then((r) => r.data),
};