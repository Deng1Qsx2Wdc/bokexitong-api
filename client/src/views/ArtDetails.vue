<template>
	<div>
		<n-h1>{{SeekBlog.title}}</n-h1>
	</div>
	<n-divider></n-divider>
	<div class ="text">{{SeekBlog.content}}</div>
	<n-divider></n-divider>
	<div class="footer">
		<div> Power by xxxx</div>
		<div> XICP-备-xxxxx号-1</div>
	</div>
</template>

<script setup>
import {ref, reactive, inject, onMounted,computed} from "vue";
import {useRoute,useRouter} from "vue-router";
import {AdminStore} from "@/stores/AdminStore.js";
const axios = inject("axios")
const router = useRouter()

const route = useRoute().query

// const boke_id = route.query.boke_id
onMounted(() => {
	cate()
})
const SeekBlog =reactive({
	boke_id:"",
	category_id:"",
	title:"",
	content:"",
})
const cate = async ()=>{
	console.log(route.id)
	try {
		SeekBlog.boke_id = route.id
		// console.log(SeekBlog)
		let result = await axios.get("http://localhost:8080/blog/seeke", {
			params: {
				boke_id: SeekBlog.boke_id,
			}
		})
		console.log(result)
		SeekBlog.title = result.data.data[0].title
		SeekBlog.content = result.data.data[0].content
		// SeekBlog.catetory_id = result.data.data[0].category_id
		console.log(SeekBlog)
	}catch(err) {
		console.error('加载失败', err)
	}
	// console.log(pageview.value)
}
</script>

<style scoped>
.text {
	font-size: 16px;
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