import request from "@/utils/request";
import RandomForest from '@/json/RandomForest.json'
import XGBoost from '@/json/XGBoost.json'
import LightGBM from '@/json/LightGBM.json'
import CatBoost from '@/json/CatBoost.json'
import Ensemble from '@/json/Ensemble.json'
import MapData from '@/json/MapData.json'

export function getMapData(data) {
    // return request.get(`/ml/yearly-city-export`);
    return Promise.resolve(MapData)
}

export function getTablePage(page, pageSize){
    return request(`/ml/table?page=${page}&pageSize=${pageSize}`)
}

export function getTableLen(data){
    return request(`/ml/table/len`)
}

// 获取随机森林的数据
export function getRandomForestData(data) {
    // return request.get(`/ml/result/random-forest`);
    return Promise.resolve(RandomForest)
}

export function getXGBoostData(data) {
    // return request.get(`/ml/result/xgboost`);
    return Promise.resolve(XGBoost)
}

export function getLightGBMData(data) {
    // return request.get(`/ml/result/light-gbm`);
    return Promise.resolve(LightGBM)
}

export function getCatBoostData(data) {
    // return request.get(`/ml/result/cat-boost`);
    return Promise.resolve(CatBoost)
}

export function getEnsembleData(data) {
    // return request.get(`/ml/result/ensemble`);
    return Promise.resolve(Ensemble)
}