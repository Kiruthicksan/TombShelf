import axios from "axios";


export const api = axios.create({
    baseURL : "https://tombshelf.onrender.com/api",
    withCredentials: true
})