<script setup>
import {ref,reactive,inject} from "vue";
import {AdminStore} from "@/stores/AdminStore.js";

const axios = inject("axios")
const adminStore = AdminStore()
const message = inject("message")

import { useRouter,useRoute} from "vue-router";
const router = useRouter()
const route = useRoute()


const admin = reactive({
	account: localStorage.getItem("account")|| "",
	password: localStorage.getItem("password")|| "",
	rember:localStorage.getItem("rember")==1|| false
})
const rules = {
	account: [
		{ required: true, message: '账号必填', trigger: 'blur' },
		{ min:3,max:12,message: "账号长度在3-12个字符",trigger: 'blur'}
	],
	password: [
		{ required: true, message: '密码必填', trigger: 'blur' },
		{ min:6,max:18,message: "账号长度在6-18个字符",trigger: 'blur'}
	]
}
const login1 = async () => {
	const result = await axios.post("http://localhost:8080/admin/login1", {
		acount: admin.account,
		password: admin.password
	})
	if (result.data.code == 200) {
		// console.log("200")
			adminStore.acount = result.data.data[0].acount;
			adminStore.id = result.data.data[0].id;
			adminStore.token = result.data.data[0].token;
			if (admin.rember) {
				localStorage.setItem("account", admin.account)
				localStorage.setItem("password", admin.password)
				localStorage.setItem("rember", admin.rember ? 1 : 0)
				router.push("/dashboard")
			}
			message.info('登录成功')
	}
}
const login2 = async () => {
	const result = await  axios.put("http://localhost:8080/admin/login2",{
		acount:admin.account,
		password:admin.password
	})
	console.log(result)
}
</script>

<template>
	<div class="login-pane">
		<n-card title="账户管理系统">
			<n-form :rules="rules" :model="admin">
				<n-form-item path="account" label="账号：">
					<n-input v-model:value="admin.account" placeholder="请输入账号"/>
				</n-form-item>
				<n-form-item path="password" label="密码：">
					<n-input v-model:value="admin.password" type="password"  placeholder="请输入密码"/>
				</n-form-item>
			</n-form>
			<template #footer>
				<n-checkbox v-model:checked="admin.rember" label="记住我" />
				<n-button @click="login1">登录</n-button>
				<n-button @click="login2">注册</n-button>
			</template>
		</n-card>
	</div>
</template>

<style lang="scss"  scoped>
.login-pane {
	display: flex;

}
.n-card {
	width: 350px;
}
</style>