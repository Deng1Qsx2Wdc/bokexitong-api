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
			<td>{{ menu.name }}</td>
			<td>{{ menu.id }}</td>
			<td>
				<n-space>
					<n-button @click="ReviseModal = true;ReviseValue.id = menu.id">修改</n-button>
					<n-button @click="deletes(menu)">删除</n-button>
				</n-space>
			</td>
		</tr>
		</tbody>
	</n-table>
	<n-modal v-model:show="ReviseModal" preset="dialog" title="Dialog">
		<template #header>
			<div>请输入类型的新名称</div>
		</template>
		<div>
			<n-form-item>
				<n-input v-model:value="ReviseValue.name" placeholder="输入类型名"/>
			</n-form-item>
		</div>
		<template #action>
			<n-button @click="Revise">确认</n-button>
		</template>
	</n-modal>
	<n-modal v-model:show="showModal" preset="dialog" title="Dialog">
		<template #header>
			<div>添加新类型</div>
		</template>
		<div>
			<n-form-item>
				<n-input v-model:value="formValue.name" placeholder="输入类型名"/>
			</n-form-item>
		</div>
		<template #action>
			<n-button @click="add">提交</n-button>
		</template>
	</n-modal>
</template>

<script setup>
import {ref, reactive, inject, onMounted} from "vue";
import {AdminStore} from "@/stores/AdminStore.js";

const axios = inject("axios")
const adminStore = AdminStore()
const message = inject("message")
const dialog = inject("dialog")


const menus = ref([])

onMounted(() => {
	cate()
})
const showModal = ref(false)
const ReviseModal = ref(false)
const formValue = reactive({
	name: ""
})
const ReviseValue = reactive({
	name: "",
	id: ""
})

const cate = async () => {
	// console.log(adminStore.token)
	let result = await axios.get("http://localhost:8080/category/token/seekall", {
				params: {
					name: "1"
				}
				,
				headers: {
					token: adminStore.token,
				}
			}
	)
	menus.value = result.data.data
	console.log(menus.value)
}
const Revise = async () => {
	// console.log(ReviseValue)
	console.log("[Revise] Token:", adminStore.token); // 检查是否为有效值
	try {
			const ReviseResult = await axios.post("http://localhost:8080/category/token/revise", {
			name: ReviseValue.name,
			id: ReviseValue.id
		},{
				headers: {
					token: adminStore.token
					// headers: { 'Authorization': `Bearer ${adminStore.token}` }
				}
			})
		if (ReviseResult.request.status === 200) {
			message.info("修改成功")
		}
	}catch (err){
		if (err.response) {
			// message.info("请先登陆")
		}
	}
}
const add = async () => {
	// console.log(adminStore.token)
	try {
		let result2 = await axios.post("http://localhost:8080/category/token/add", {
			name: formValue.name
		}, {
			headers: {
				token: adminStore.token
			}
		})
		// console.log("result2")
		if (result2.request.status === 200) {
			message.info("添加成功")
		}
	} catch (err) {
		if (err.response)
			message.info("请先登陆")
	}
}
const deletes = async (menu) => {
	console.log(menu)

	dialog.warning({
		title: '警告',
		content: '是否删除？',
		positiveText: '确定',
		negativeText: '不确定',
		draggable: true,
		onPositiveClick: async () => {
			try {
				let result2 = await axios.post("http://localhost:8080/category/token/delete", {
					name: menu.name,
					id: menu.id
				}, {
					headers: {
						token: adminStore.token
					}
				})
				if (result2.request.status === 200) {
					message.info("删除成功")
				}
			} catch (err) {
				if (err.response)
					message.info("请先登陆")
			}
		},
		onNegativeClick: () => {
		}
	})
}
</script>

<style scoped>

</style>