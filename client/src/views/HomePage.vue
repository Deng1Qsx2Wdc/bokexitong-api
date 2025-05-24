<template>
<div class="header">
	<span class="first">首页</span>
	<n-popselect v-model:value="cateOption.value" :options="options" trigger="click">
		<span class="spece">
			{{'分类' }}
			<span >{{SpecificType}}</span>
		</span>
	</n-popselect>
	<span  class = "bash" @click= "Login">后台</span>
	<n-divider></n-divider>

	<n-divider></n-divider>
	<div class="footer">
		<div> Power by xxxx</div>
		<div> XICP-备-xxxxx号-1</div>
	</div>
</div>
</template>

<script setup>
import {ref, reactive, inject, onMounted,computed} from "vue";
import {AdminStore} from "@/stores/AdminStore.js";
import router from "@/router/index.js";
const axios = inject("axios")
const adminStore = AdminStore()
const message = inject("message")
const dialog = inject("dialog")
const options = ref([])

const cateOption = reactive({
	label:"",
	value:"",
})

const value = ref(null)

onMounted(()=>{
	mate()
})
const mate = async () => {
	// console.log("执行了")
	try {
		let result = await axios.get("http://localhost:8080/category/seekall", {
			params: {
				name: "1"
			}
		})
		console.log(result.data.data)
		options.value = result.data.data.map(item=>({// 对每个数组元素执行箭头函数,返回新数组
			label:item.name,
			value:item.id
		}))
	}catch(err) {
		console.error('加载失败', error)
	}
}
const SpecificType = computed(()=>{
	let selectOption = options.value.find((option) => {//查找第一个满足条件的  选项对象 option
		return option.value == cateOption.value//条件是其 value 属性与 selectedCategory.value 的值相等
	})
	return selectOption ? selectOption.label:""
})
const Login = ()=>{
	router.push("/login")
}
</script>

<style scoped>
.header {
	width: 1200px;
	margin: 0 auto;
	padding-top: 24px;
}
.first,
.bash {
	font-size: 24px;
	padding-top: 24px;
	color: #7f7f7f;
	margin-right: 15px;
	&:hover{
		cursor: pointer;
		color: #ff6600;
	}
	n-popselect {
		margin-right: 15px;
	}
}
.spece {
	font-size: 24px;
	color: #7f7f7f;
	margin-right: 15px;
	&:hover{
		cursor: pointer;
		color: #ff6600;
	}
	span {
		font-size: 16px;
		color: #ca621d;
	}
}
.footer{
	div {
		display:block;
		&:hover{
			color: #a39696;
		}
	}
	text-align:center ;
	line-height: 25px;
	color: #a39696;
}
</style>