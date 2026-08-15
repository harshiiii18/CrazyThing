import api from "../api/axios";

export const adminService = {
  getAnalytics: () => api.get("/admin/analytics").then((r) => r.data),
  listUsers: () => api.get("/admin/users").then((r) => r.data),
  setUserStatus: (id, isActive) =>
    api.patch(`/admin/users/${id}/status`, { isActive }).then((r) => r.data),
  setSellerVerification: (id, status, rejectionReason) =>
    api.patch(`/admin/users/${id}/verification`, { status, rejectionReason }).then((r) => r.data),
  listAllProducts: () => api.get("/admin/products").then((r) => r.data),
  setProductStatus: (id, status) =>
    api.patch(`/admin/products/${id}/status`, { status }).then((r) => r.data),
};