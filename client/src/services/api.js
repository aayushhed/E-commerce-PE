import axios from "axios";

const API = axios.create({
  baseURL:
    "https://prakash-enterprises-api.onrender.com/api",
});

export default API;