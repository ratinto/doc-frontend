import axios from "axios";

const api = axios.create({
  baseURL: "https://doc-backend-xhh5.onrender.com/api/",
});

export const setAuthToken = (accessToken) => {
  if (accessToken) {
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== `${api.defaults.baseURL}token/refresh/`
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(
            `${api.defaults.baseURL}token/refresh/`,
            {
              refresh: refreshToken,
            }
          );

          const newAccessToken = refreshResponse.data.access;

          localStorage.setItem("accessToken", newAccessToken);
          if (refreshResponse.data.refresh) {
            localStorage.setItem("refreshToken", refreshResponse.data.refresh);
          }

          setAuthToken(newAccessToken);

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setAuthToken(null);
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setAuthToken(null);
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;