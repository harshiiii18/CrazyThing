import api from "../api/axios";

export const authService = {
  signup: (payload) => api.post("/auth/signup", payload).then((r) => r.data),
  login: (payload) => api.post("/auth/login", payload).then((r) => r.data),
  logout: () => api.post("/auth/logout").then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
  forgotPassword: (email) =>
    api.post("/auth/forgot-password", { email }).then((r) => r.data),
  resetPassword: (payload) =>
    api.post("/auth/reset-password", payload).then((r) => r.data),
};
