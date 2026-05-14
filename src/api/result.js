import request from "@/utils/request";

export function getMapData(data) {
    return request.get(`/ml/yearly-city-export`);
}

// 获取随机森林的数据
export function getForestData(data) {
    return request.get(`/ml/result/forest`);
}