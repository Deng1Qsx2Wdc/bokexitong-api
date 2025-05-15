import {createRouter,createWebHashHistory } from "vue-router"
import Test from '../views/Test.vue'
import Admin from "@/views/Login.vue";
import Dashboard from "../views/dashboard/Dashboard.vue"

const router = [
    {path:'/test',component:Test},
    {path:'/dashboard',component:Dashboard},
    {path: '/admin', component: Test},
]


// const router = createRouter({
//     history:createWebHashHistory(),
//     routes
// });

export default router
