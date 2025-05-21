<script setup>
import {ref,reactive,inject} from "vue";
import {AdminStore} from "@/stores/AdminStore.js";

const axios = inject("axios")
const adminStore = AdminStore()

import { useRouter,useRoute} from "vue-router";
const router = useRouter()
const route = useRoute()

	let menus =[
		{name:"文章管理",href:"/dashboard/article"},
		{name:"分类管理",href:"/dashboard/category"},
		{name:"退出",href:"/logout"}
	]
	const toPage = (menu)=>{
	console.log(adminStore.token)
		if(menu.href === "/logout"){
			window.location.href ="/login"
		}else {
			router.push(menu.href)
		}
	}


</script>

<template>
	<div class = "main-pinel">
		<div  class="left" >
			<div v-for="(menu,index) in menus" @click = "toPage(menu)">
				{{menu.name}}
			</div>
		</div >
		<div class="right" >
			<router-view></router-view>
		</div>
	</div>
</template>

<style scoped>
.main-pinel {
	display: flex;
	height: 100vh;
	border-right: 1.5px inset #bbbbbb;
}
.left {
	div{
		display: flex;
		width: 150px;
		height: 75px;
		color: #7f7f7f;
		justify-content: center;
		align-items: center;
		&:hover{
			cursor: pointer;
			color: #f0ad4e;
		}
	}
}
.right {
	flex: 1;
	padding: 20px;
}

</style>