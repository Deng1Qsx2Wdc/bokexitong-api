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

	<BlogHome></BlogHome>
	<n-divider></n-divider>
	<div class="footer">
		<div> Power by xxxx</div>
		<div> XICP-备-xxxxx号-1</div>
	</div>
</div>
</template>

<script setup>
import {ref, reactive, inject, onMounted, computed, watch} from "vue";
import {AdminStore} from "@/stores/AdminStore.js";
import router from "@/router/index.js";
import BlogHome from "@/views/BlogHome.vue";
import RichTextEditor from "@/components/RichTextEditor.vue";
import ArtDetails from "@/views/ArtDetails.vue";
const axios = inject("axios")
const adminStore = AdminStore()
const message = inject("message")
const dialog = inject("dialog")
const options = ref([])

const cateOption = reactive({
	label:"",
	value:"",
})


// const menus = ref([])
// const value = ref(null)
// const PageInfor = reactive({
//
// 	page: 1,
// 	keyword:"",
// 	pageSize:3,
// 	blogtotal:0,//博客总数
// 	pagetotal:0//总页数
// })
onMounted(()=>{
	mate()
	// cate()
})
// const Page = ()=>{
// 	PageInfor.page = page
// 	// console.log(PageInfor.page)
// 	cate()
// }
// const cate = async () => {
// 	// console.log("执行了")
// 	// console.log(PageInfor.page)
// 	let result = await axios.get("http://localhost:8080/blog/seek", {
// 		params: PageInfor,
// 		headers: {
// 			token: adminStore.token
// 		}
// 	})
// 	PageInfor.blogtotal=result.data.data.sumber
// 	PageInfor.pagetotal=Math.floor(PageInfor.blogtotal / PageInfor.pageSize) +(PageInfor.blogtotal % PageInfor.pageSize !==0 ?1:0)
// 	// console.log(result.data.data)
// 	for (let rows of  result.data.data.result) {//将遍历到数据取别名为rows
// 		const date = new Date(rows.create_time)
// 		rows.create_time = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
// 		rows.content = rows.content.slice(0, 50)+"..."//截取字符串前 50 个字符
// 	}
// 	menus.value = result.data.data.result
// 	// console.log(result.data.data)
// 	// console.log(menus.value)
// }

const mate = async () => {
	// console.log("执行了")
	try {
		let result = await axios.get("http://localhost:8080/category/seeks", {
			params: {
				name: "1"
			}
		})
		// console.log(result.data.data)
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