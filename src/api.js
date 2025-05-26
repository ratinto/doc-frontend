import axios from "axios";

const api = axios.create({
  baseURL: "https://doc-backend-xhh5.onrender.com/api/",
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;