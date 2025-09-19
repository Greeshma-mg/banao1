import axios from "axios";

const api = axios.create({
  baseURL: "https://banao1.onrender.com/api",
});

export default api;
