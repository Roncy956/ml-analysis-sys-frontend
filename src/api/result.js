import request from "@/utils/request";

export function getMapData(data) {
    return request.get(`/ml/yearly-city-export`);
}

// 获取随机森林的数据
export function getRandomForestData(data) {
    return request.get(`/ml/result/random-forest`);
}

export function getXGBoostData(data) {
    return request.get(`/ml/result/xgboost`);
}

export function getLightGBMData(data) {
    return request.get(`/ml/result/light-gbm`);
}

export function getCatBoostData(data) {
    return request.get(`/ml/result/cat-boost`);
}