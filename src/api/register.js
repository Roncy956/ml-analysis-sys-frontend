import request from "@/utils/request";

// 注册用户
export function addUser(data) {
    return request.post(`/register/user`, data);
}

// 注册管理员
export function addAdmin(data) {
    return request.post(`/register/admin`, data);
}

// 验证邀请码
export function checkCode(inviteCode){
    return request.get(`/register/invite/admin?key=${inviteCode}`)
}