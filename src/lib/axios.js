import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.mode === "development" ? "http://localhost:3000/graphql" : "/graphql",
    withCredentials: true, //send cookies to server
})

export default axiosInstance