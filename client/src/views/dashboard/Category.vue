<script setup>
import {ref, reactive, inject,onMounted} from "vue";
import {AdminStore} from "@/stores/AdminStore.js";

const axios = inject("axios")
const adminStore = AdminStore()
const message = inject("message")


import {useRouter, useRoute} from "vue-router";

const router = useRouter()
const route = useRoute()

const menus= ref([])

onMounted(()=>{
	cate()
})
const  showModal =ref(false)
const formValue = reactive({
	name:""
})
const cate = async () => {
	// console.log("执行了")
	let result = await  axios.post("http://localhost:8080/category/seekall",{
		params:{name:"1"}
	})
	menus.value =result.data.data
	// console.log(menus.value)
}
const add = async () => {
	// console.log(adminStore.token)
	let result2 = await  axios.post("http://localhost:8080/category/token/add",{
		name:formValue.name
	},{
		headers:{
			token: adminStore.token
		}
	})
	// console.log(result2)
}
</script>

<template>
	<n-button @click="showModal = true">添加</n-button>
	<n-table :bordered="false" :single-line="false">
		<thead type="  width: 100%;">
		<tr>
			<th>编号</th>
			<th>类型</th>
			<th>操作</th>
		</tr>
		</thead>
		<tbody>
		<tr v-for="(menu,id) in menus " :key="menus.id">
<!--			<td>menu.name</td>-->
			<td>{{ menu.name}}</td>
			<td>{{ menu.id }}</td>
<!--			<td>menu.id </td>-->
			<td>
				<button >修改</button>
				<button>删除</button>
			</td>
		</tr>
		</tbody>
	</n-table>
	<n-modal v-model:show="showModal" preset="dialog" title="Dialog">
		<template #header>
			<div>添加新类型</div>
		</template>
		<div>
			<n-form-item >
				<n-input  v-model:value="formValue.name" placeholder="输入类型名" />
			</n-form-item>
		</div>
		<template #action>
			<n-button @click="add">提交</n-button>
		</template>
	</n-modal>
</template>

<style scoped>

</style>