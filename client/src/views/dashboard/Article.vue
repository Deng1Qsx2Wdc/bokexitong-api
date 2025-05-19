<template>
	<n-tabs default-value="addArticle" justify-content="space-evenly" type="line">
		<n-tab-pane name="oasis" tab="列表">

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
		</n-tab-pane>
		<n-tab-pane name="jay chou" tab="周杰伦">
			七里香
		</n-tab-pane>
	</n-tabs>
	<n-button @click ="handle">提交</n-button>
</template>


<script setup>
import {ref, reactive, toRaw,inject, onMounted} from "vue";
import RichTextEditor from "../../components/RichTextEditor.vue"
const axios = inject("axios")
import {AdminStore} from "@/stores/AdminStore.js";


const message = inject("message")

const adminStore = AdminStore()

onMounted(() => {
	mate()
})
const options =ref([])
const mate = async () => {
	// console.log("执行了")
	let result = await axios.post("http://localhost:8080/category/seekall", {
		params: {name: "1"}
	})
	options.value = result.data.data.map((item)=>{
		// console.log(item)
		//map 是 JavaScript 数组的方法，用于遍历数组中的每个元素，
		// 并对每个元素执行一个函数，最终返回一个新数组。
		return {
			label:item.name,
			value:item.id
		}
	})
	// console.log(options.value)
}
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