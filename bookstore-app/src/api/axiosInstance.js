import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 5000,
});

//request interceptor : Handling Token append to Headers
axiosInstance.interceptors.request.use(
  (config) => {
    const isPublicAuthRequest = ["/login", "/register", "/google-login"].includes(
      config.url,
    );
    const token = isPublicAuthRequest ? null : sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - global/common error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response received");
    return response;
  },

  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.log("Unauthorized");
      } else if (status === 404) {
        console.log("API Not Found");
      } else if (status === 409) {
        console.log("Conflict - User already exists");
      } else if (status === 500) {
        console.log("Server Error!!");
      }
    } else if (error.request) {
      console.log("Client Error - No response from server");
    } else {
      console.log("Error: " + error.message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
