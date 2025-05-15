import {createRouter,createWebHashHistory } from "vue-router"
import Test from '../views/Test.vue'
import Admin from "@/views/Login.vue";
import Dashboard from "../views/dashboard/Dashboard.vue"
import Category from "../views/dashboard/Category.vue"
import Article from "../views/dashboard/Article.vue"
// import Test from  '../common/router.js'
import Login from "../views/Login.vue"
const router = [
    {path:'/test',component:Test},
    {path:'/dashboard',component:Dashboard,children:[
            {path: '/dashboard/category', component: Category},
            {path: '/dashboard/article', component: Article},
        ]},
    {path: '/login', component: Login},
    {path: '/admin', component: Test},
]


// const router = createRouter({
//     history:createWebHashHistory(),
//     routes
// });

export default router
