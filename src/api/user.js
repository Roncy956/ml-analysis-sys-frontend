import request from "@/utils/request";

// 获取用户列表
export function getUserFileList(userId) {
    return request.get(`/user/count/files?userId=${userId}`);
}