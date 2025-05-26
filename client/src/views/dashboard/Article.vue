<template>
	<n-tabs v-model:value="pageview" justify-content="space-evenly" type="line">
		<n-tab-pane name="articleList" tab="文章列表">
			<div>
				<div v-for="(blog,id) in menus" :key="id" style="margin-bottom: 15px">
					<n-card :title="blog.title">
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
							<n-button @click = "ArtUpdate(blog)">
								修改
							</n-button>
							<n-button @click = "ArtDelete(blog)">
								删除
							</n-button>
						</template>
					</n-card>
				</div>
				<n-space>
						<div   class="div-center" @click="Page(PageNu)" v-for="PageNu in PageInfor.pagetotal" >
							<div class="page" :style="'color:' + (PageNu === PageInfor.page ? 'blue' : 'black') ">
								{{PageNu}}
							</div>
						</div>
				</n-space>
			</div>
		</n-tab-pane>

		<n-tab-pane name="addArticle" tab="添加文章">
			<n-form>
				<n-form-item label="标题:" path="inputValue">
					<n-input v-model:value="addArticle.title" placeholder="标题" />
				</n-form-item>
				<n-form-item label="类型:" path="inputValue">
					<n-select v-model:value="value" :options="options" />
				</n-form-item>
				<n-form-item label="正文:" path="inputValue">
					<rich-text-editor @content-update="addArticle.content = $event"></rich-text-editor>
				</n-form-item>
			</n-form>
			<n-button @click ="handle">提交</n-button>
		</n-tab-pane>

		<n-tab-pane name="revise" tab="修改文章">
			<n-form>
				<n-form-item label="标题:" path="inputValue">
					<n-input v-model:value="ReviseArticle.title" placeholder="标题" />
				</n-form-item>
				<n-form-item label="类型:" path="inputValue">
					<n-select v-model:value="ReviseArticle.category_id" :options="options" />
				</n-form-item>
				<n-form-item label="正文:" path="inputValue">
					<rich-text-editor v-model="ReviseArticle.content "></rich-text-editor>
				</n-form-item>
				<n-button @click = "updateblog">修改</n-button>
			</n-form>
		</n-tab-pane>
	</n-tabs>

</template>


<script setup>
import {ref, reactive, toRaw,inject, onMounted} from "vue";
import RichTextEditor from "../../components/RichTextEditor.vue"
const axios = inject("axios")
import {AdminStore} from "@/stores/AdminStore.js";
const message = inject("message")

const adminStore = AdminStore()
const addArticle = reactive({
	catetory_id:0,
	title:"",
	content:""
})
const ReviseArticle =reactive({
	boke_id:"",
	category_id:"",
	title:"",
	content:"",
})
// keyword, categoryID, page, pageSize
const PageInfor = reactive({
	page: 1,
	pageSize:3,
	blogtotal:0,//博客总数
	pagetotal:0//总页数
})
const pageview = ref("articleList")
const menus = ref([])

const value =ref(null)
const options = ref([])


onMounted(() => {
	cate()
	mate()
})

const Page = (PageNum)=>{
	PageInfor.page = PageNum
	console.log(PageInfor.page)
	cate()
}

const ArtUpdate = async (blog)=>{//为了获得单篇文章的信息，然后使用这些信息更新数据在“修改文章”渲染出来
	console.log(blog)
	try {
		ReviseArticle.boke_id = blog.boke_id
		ReviseArticle.category_id = blog.category_id
		console.log(ReviseArticle)
		let result = await axios.get("http://localhost:8080/blog/seeke", {
			params: {
				boke_id: ReviseArticle.boke_id,
				page:"",
				pageSize:""
			}
		})
		console.log(result)
		ReviseArticle.title = result.data.data[0].title
		ReviseArticle.content = result.data.data[0].content
		// ReviseArticle.catetory_id = result.data.data[0].category_id
		console.log(ReviseArticle)
		pageview.value = "revise"
	}catch(err) {
		console.error('加载失败', err)
	}
	// console.log(pageview.value)
}
const ArtDelete = async (blog)=>{
	console.log(blog)
	try{
		const result = await axios.post("http://localhost:8080/blog/token/delete",
			blog, {
					headers: {
						token: adminStore.token
					}
				}
			)
	}catch(err) {
		console.log(err)
	}
}
const updateblog = async()=>{
	try {
		console.log(ReviseArticle)
		const result = await axios.post("http://localhost:8080/blog/token/update",
					ReviseArticle, {
					headers: {
						token: adminStore.token
					}
				}
		)
		// console.log(result.status)
		if (result.status === 200) {
			console.log("修改成功")
			pageview.value = "articleList"
			message.info("修改成功")
		}
	}catch (err){
		if(err.response){
			message.info("请先登陆")
		}
	}
}
const addArticle_content =(text)=>{
	console.log(text)
	addArticle.content = text
}
const handleContentUpdate =(html)=>{
	console.log(html)
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


const mate = async () => {
	// console.log("执行了")
	try {
		// console.log("111")
		let result = await axios.get("http://localhost:8080/category/seeks", {
			headers: {
				token: adminStore.token
			}
		})
		// console.log(result.data)
		options.value = result.data.data.map(item=>({// 对每个数组元素执行箭头函数,返回新数组
			label:item.name,
			value:item.id
		}))
		// console.log(options.value)
		// console.log(JSON.stringify(options.value))
	}catch(err) {
		console.error('加载失败', err)
	}
}

const handle = async () => {
	try {
		addArticle.category_id = value
		const result = await axios.post("http://localhost:8080/blog/token/add",
				addArticle,
				{
					headers: {
						token: adminStore.token
						// headers: { 'Authorization': `Bearer ${adminStore.token}` }
					}
				}
		)
		// console.log(result.status)
		if (result.status === 200) {
			console.log("添加成功")
			message.info("添加成功")
		}
	}catch (err){
		if(err.response){
			message.info("请先登陆")
		}
	}
};
</script>


<style scoped>
.div-center {
	display: flex;
	justify-content: center;    /* 水平居中 */
	align-items: center;        /* 垂直居中 */
	gap: 20px;                  /* 子元素间距 */
	min-height: 50px;
}
.page{
	display: flex;
	background-color: silver;
	justify-content: center;
	align-items: center;
	width: 35px;
	height: 35px;
	border: 1px solid #85955f;
	&:hover{
		cursor: pointer;
		color: blue;
	}
}
</style>