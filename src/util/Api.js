import Axios from "axios";
import { BASE_URL_LIVE, BASE_URL_DEV } from "../../api";
import createAuthRefreshInterceptor from "axios-auth-refresh";

let base_url = `http://localhost:3000/api/`;

if (process.env.NODE_ENV !== "development") {
  base_url = BASE_URL_LIVE;
} else {
  base_url = BASE_URL_DEV;
}

let axios = Axios.create({
  baseURL: base_url,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 2000000
});

// Move the interceptors setup into a separate function
const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("x-auth-token");
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (
        (error.response?.status === 401 || error.response?.status === 500) &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("x-auth-refresh-token");
          const fetchResp = await fetch(`${base_url}/user/refresh-token`, {
            method: "get",
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          });
          const response = await fetchResp.json();
          const newAccessToken = response.data.token;
          const newRefreshToken = response.data.refreshToken;

          localStorage.setItem("x-auth-refresh-token", newRefreshToken);
          localStorage.setItem("x-auth-token", newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (error) {
          // Handle errors if the token refresh fails
        }
      }

      return Promise.reject(error);
    }
  );
};

// Check if window is defined and call the setupAxiosInterceptors function
if (typeof window !== "undefined") {
  setupAxiosInterceptors();
}

export { base_url };
export default axios;
