import api from "../api/axios";

export const orderService = {
  create: (addressId, notes) =>
    api.post("/orders", { addressId, notes }).then((r) => r.data),
  myOrders: () => api.get("/orders").then((r) => r.data),
  getById: (id) => api.get(`/orders/${id}`).then((r) => r.data),
  cancel: (id, reason) => api.patch(`/orders/${id}/cancel`, { reason }).then((r) => r.data),
  markDelivered: (id) => api.patch(`/orders/${id}/deliver`).then((r) => r.data),

  // Seller-side
  sellerOrders: () => api.get("/orders/seller/mine").then((r) => r.data),
  sellerRespond: (id, action, reason) =>
    api.patch(`/orders/${id}/seller-action`, { action, reason }).then((r) => r.data),
  markPacked: (id) => api.patch(`/orders/${id}/pack`).then((r) => r.data),
  markShipped: (id, payload) => api.patch(`/orders/${id}/ship`, payload).then((r) => r.data),
};

export const paymentService = {
  verify: (payload) => api.post("/payments/verify", payload).then((r) => r.data),
  markFailed: (orderId) => api.post(`/payments/${orderId}/mark-failed`).then((r) => r.data),
};