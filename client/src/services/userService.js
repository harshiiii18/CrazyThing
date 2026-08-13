import api from "../api/axios";

export const userService = {
  updateProfile: (payload) => api.put("/users/me", payload).then((r) => r.data),
  changePassword: (payload) => api.put("/users/me/password", payload).then((r) => r.data),
  getPublicProfile: (username) => api.get(`/users/${username}`).then((r) => r.data),
};