import request from "@/utils/request";

// 用户登录
export function getUser(data) {
    return request.post(`/login/user`, data);
}

// 管理员登录
export function getAdmin(data){
    return request.post(`/login/admin`, data);
}