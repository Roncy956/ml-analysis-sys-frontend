import {createRouter, createWebHistory} from 'vue-router'
import Homepage from "@/views/main/user/Homepage.vue";
import DataView from "@/views/main/user/DataView.vue";
import MainFrame from "@/views/main/user/MainFrame.vue";
import Profile from "@/views/main/user/Profile.vue";
import ValueMap from "@/views/main/user/ml/ValueMap.vue";
import RandomForest from "@/views/main/user/ml/RandomForest.vue";
import XGBoost from "@/views/main/user/ml/XGBoost.vue";
import LightGBM from "@/views/main/user/ml/LightGBM.vue";
import CatBoost from "@/views/main/user/ml/CatBoost.vue";
import PersonalHomepage from "@/views/main/user/profile/PersonalHomepage.vue";
import PersonalSetting from "@/views/main/user/profile/PersonalSetting.vue";
import AuthForm from "@/views/auth/AuthForm.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/authForm', component: AuthForm},
        {
            path: '/',
            component: MainFrame,
            redirect: '/homepage',  // 可选，访问根时自动跳到主页
            children: [
                {
                    path: 'homepage',
                    component: Homepage,
                },
                {
                    path: 'profile',
                    component: Profile,
                    children: [
                        {
                            path: 'personal-homepage',
                            component: PersonalHomepage,
                        },
                        {
                            path: 'personal-setting',
                            component: PersonalSetting,
                        }
                    ]
                },
                {
                    path: 'data-analysis',
                    component: DataView,
                    children: [
                        {
                            path: 'value-map',
                            component: ValueMap,
                        },
                        {
                            path: 'random-forest',
                            component: RandomForest,
                        },
                        {
                            path: 'xgboost',
                            component: XGBoost,
                        },
                        {
                            path: 'light-gbm',
                            component: LightGBM,
                        },
                        {
                            path: 'cat-boost',
                            component: CatBoost,
                        },
                    ]
                },
            ]
        },
        {path: '/:pathMatch(.*)*', redirect: '/authForm'} // 404 兜底
    ],
})

// 导航守卫


export default router;
