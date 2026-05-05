import {createRouter, createWebHistory} from 'vue-router'
import Homepage from "@/views/main/user/Homepage.vue";
import DataView from "@/views/main/user/DataView.vue";
import SVM from "@/views/main/user/ml/SVM.vue";
import MainFrame from "@/views/main/user/MainFrame.vue";
import Profile from "@/views/main/user/Profile.vue";
import KNN from "@/views/main/user/ml/KNN.vue";
import LinearRegression from "@/views/main/user/ml/LinearRegression.vue";
import LogisticRegression from "@/views/main/user/ml/LogisticRegression.vue";
import DecisionTree from "@/views/main/user/ml/DecisionTree.vue";
import RandomForest from "@/views/main/user/ml/RandomForest.vue";
import NaiveBayes from "@/views/main/user/ml/NaiveBayes.vue";
import GradientBoosting from "@/views/main/user/ml/GradientBoosting.vue";
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
                            path: 'linear-regression',
                            component: LinearRegression,
                        },
                        {
                            path: 'logistic-regression',
                            component: LogisticRegression,
                        },
                        {
                            path: 'decision-tree',
                            component: DecisionTree,
                        },
                        {
                            path: 'random-forest',
                            component: RandomForest,
                        },
                        {
                            path: 'svm',
                            component: SVM,
                        },
                        {
                            path: 'knn',
                            component: KNN,
                        },
                        {
                            path: 'naive-bayes',
                            component: NaiveBayes,
                        },
                        {
                            path: 'gradient-boosting',
                            component: GradientBoosting,
                        }
                    ]
                },
            ]
        },
        {path: '/:pathMatch(.*)*', redirect: '/authForm'} // 404 兜底
    ],
})

// 导航守卫


export default router;
