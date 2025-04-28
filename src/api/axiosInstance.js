import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7114/api",
});

export default axiosInstance;