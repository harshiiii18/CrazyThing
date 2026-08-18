import api from "../api/axios";

export const aiService = {
  listingAssist: (input) => api.post("/ai/listing-assist", { input }).then((r) => r.data),
};