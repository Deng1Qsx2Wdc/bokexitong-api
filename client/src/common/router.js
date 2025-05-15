import {createRouter,createWebHashHistory } from "vue-router"
import Test from '../views/Test.vue'
import Admin from "@/views/Login.vue";
// let routes = []

const routes = [
    {path:'/test',component:Test},
    {path: '/admin', component: Admin,
},
]


// const router = createRouter({
//     history:createWebHashHistory(),
//     routes
// });

export default routes
