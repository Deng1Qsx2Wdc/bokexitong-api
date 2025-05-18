<template>
	<n-tabs default-value="addArticle" justify-content="space-evenly" type="line">
		<n-tab-pane name="oasis" tab="Oasis">
			Wonderwall
		</n-tab-pane>
		<n-tab-pane name="addArticle" tab="添加文章">
			<n-form>
				<n-form-item label="标题:" path="inputValue">
					<n-input v-model:value="addArticle.title" placeholder="Input" />
				</n-form-item>
				<n-form-item label="正文:" path="inputValue">
					<rich-text-editor @content-update="addArticle.content = $event"></rich-text-editor>
				</n-form-item>
			</n-form>
		</n-tab-pane>
		<n-tab-pane name="jay chou" tab="周杰伦">
			七里香
		</n-tab-pane>
	</n-tabs>
</template>
<script setup>
import {ref,reactive,inject} from "vue";
import {AdminStore} from "@/stores/AdminStore.js";
import RichTextEditor from "../../components/RichTextEditor.vue"
const axios = inject("axios")
const adminStore = AdminStore()

import { useRouter,useRoute} from "vue-router";
const router = useRouter()
const route = useRoute()

const addArticle = reactive({
	catetory_id:0,
	title:"",
	content:""
})
console.log(addArticle)
const handleContentUpdate =(html)=>{
	console.log(html)
}

</script>



<style scoped>

</style>