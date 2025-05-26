<template>
	<n-space class="search">
		<n-input class="sear" v-model:value="value" type="text" placeholder="请输入关键词或者文章名" />
		<n-button @click = "Search">搜索</n-button>
	</n-space>

	<div>
		<div  v-for="(blog,id) in menus" :key="id" style="margin-bottom: 15px">
			<n-card @click = "IntoBlog(blog)" :title="blog.title">
				<template #header-extra>
					<!--							{{blog.title}}-->
				</template>
				<!--						卡片内容-->
				<template #footer>
					{{blog.content}}
				</template>
				<template #action>
						<span style="display: block">
							发布时间:{{ blog.create_time }}
						</span>
<!--					<n-button  >阅读</n-button>-->
				</template>
			</n-card>
		</div>
		<n-space>
			<n-pagination @click="Page" v-model:page="page" :page-count="PageInfor.pagetotal" />
		</n-space>
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
const menus = ref([])
const value = ref(null)

const page = ref(1)
const IntoBlog = (blog) => {
	router.push({path:"/artDetails",query:{id:blog.boke_id}})
}
onMounted(()=>{
	cate()
})
const PageInfor = reactive({
	page: 1,
	pageSize:3,
	blogtotal:0,//博客总数
	pagetotal:0//总页数
})
const Page = ()=>{
	PageInfor.page = page
	// console.log(PageInfor.page)
	cate()
}
const cate = async () => {
	// console.log("执行了")
	// console.log(PageInfor.page)
	let result = await axios.get("http://localhost:8080/blog/seek", {
		params: PageInfor,
		headers: {
			token: adminStore.token
		}
	})
	PageInfor.blogtotal=result.data.data.sumber
	PageInfor.pagetotal=Math.floor(PageInfor.blogtotal / PageInfor.pageSize) +(PageInfor.blogtotal % PageInfor.pageSize !==0 ?1:0)
	// console.log(result.data.data)
	for (let rows of  result.data.data.result) {//将遍历到数据取别名为rows
		const date = new Date(rows.create_time)
		rows.create_time = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
		rows.content = rows.content.slice(0, 50)+"..."//截取字符串前 50 个字符
	}
	menus.value = result.data.data.result
	// console.log(result.data.data)
	// console.log(menus.value)
}
const Search = async () => {
	// console.log(value)
	PageInfor.keyword = value
	let result = await axios.get("http://localhost:8080/blog/seek", {
		params: PageInfor,
		headers: {
			token: adminStore.token
		}
	})
	PageInfor.blogtotal=result.data.data.sumber
	PageInfor.pagetotal=Math.floor(PageInfor.blogtotal / PageInfor.pageSize) +(PageInfor.blogtotal % PageInfor.pageSize !==0 ?1:0)
	// console.log(result.data.data)
	for (let rows of  result.data.data.result) {//将遍历到数据取别名为rows
		const date = new Date(rows.create_time)
		rows.create_time = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
		rows.content = rows.content.slice(0, 50)+"..."//截取字符串前 50 个字符
	}
	menus.value = result.data.data.result
	// console.log(result.data.data)
	// console.log(menus.value)
}
</script>

<style scoped>
.search {
	display: flex;
	margin: 0 auto;
	margin-bottom: 20px;
	width: 500px;
}
.sear {
	width: 250px;
}
</style>