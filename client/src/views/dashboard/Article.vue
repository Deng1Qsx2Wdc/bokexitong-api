<template>
	<n-tabs default-value="articleList" justify-content="space-evenly" type="line">
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
							<n-button>
								修改
							</n-button>
							<n-button>
								删除
							</n-button>
						</template>
					</n-card>
				</div>
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
					<rich-text-editor @content-update="addArticle.content"></rich-text-editor>
				</n-form-item>
			</n-form>
			<n-button @click ="handle">提交</n-button>
		</n-tab-pane>
		<n-tab-pane name="jay chou" tab="第三模块">
			七里香
		</n-tab-pane>
	</n-tabs>

</template>


<script setup>
import {ref, reactive, toRaw,inject, onMounted} from "vue";
import RichTextEditor from "../../components/RichTextEditor.vue"
const axios = inject("axios")
import {AdminStore} from "@/stores/AdminStore.js";
// import dayjs from "dayjs"

const message = inject("message")

const adminStore = AdminStore()

// let timer = ref(null);
// const startTimer = () => {
// 	timer = setInterval(() => {
// 		console.log('Timer running...');
// 	}, 1000);
// }

onMounted(() => {
	cate()
	// () => {
	// 	if (timer) clearInterval(timer); // 清理定时器
	// }
})

const menus = ref([])

const cate = async () => {
	// console.log("执行了")
	let result = await axios.get("http://localhost:8080/blog/token/seek", {
		params: {
			name: "1"
		},
		headers: {
			token: adminStore.token
			// headers: { 'Authorization': `Bearer ${adminStore.token}` }
		}
	})
	console.log(result.data.data)
	let temp = result.data.data
	for (let rows of  result.data.data) {//将遍历到数据取别名为rows
		const date = new Date(rows.create_time)
		rows.create_time = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

	}
	menus.value = temp
	// console.log(menus.value)
}
const options =ref([])

const value =ref(null)


const addArticle_content =(text)=>{
	console.log(text)
	addArticle.content = text
}
const addArticle = reactive({
	catetory_id:0,
	title:"",
	content:""
})
// console.log(addArticle)
const handleContentUpdate =(html)=>{
	console.log(html)
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

</style>