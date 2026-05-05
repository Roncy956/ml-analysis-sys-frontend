import axios from "axios";
import { ElMessage } from "element-plus";

import {useRouter} from "vue-router"
const router = useRouter()

//创建axios实例对象
const request = axios.create({
    baseURL: "/api",
    timeout: 600000,
});

// 请求拦截器
request.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    if (token) {
        config.headers.token = token;
    }
    if (id) {
        config.headers.id = id;
    }
    return config;
});

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response?.status === 401) {
            ElMessage.error("登录失效，请重新登录");
            router.push("/authForm");
        }
        return Promise.reject(error);
    }
);
export default request;
