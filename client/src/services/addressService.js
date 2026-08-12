import api from "../api/axios";

export const addressService = {
  list: () => api.get("/addresses").then((r) => r.data),
  create: (payload) => api.post("/addresses", payload).then((r) => r.data),
  update: (id, payload) => api.put(`/addresses/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/addresses/${id}`).then((r) => r.data),
};
