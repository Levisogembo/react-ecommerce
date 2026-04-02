import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.mode === "development" ? "http://localhost:3000/graphql" : "/graphql",
    withCredentials: true, //send cookies to server
})

axiosInstance.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token')

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default axiosInstance