import api from "../api/axios";

export const categoryService = {
  list: () => api.get("/categories").then((r) => r.data),
};
