<template>
	<n-space vertical>
		<n-select v-model:value="value" :options="options" />
	</n-space>
</template>

<script setup>
import {onMounted, ref} from 'vue'

const menus = ref([])

const cate = async () => {
	// console.log("执行了")
	let result = await axios.post("http://localhost:8080/category/seekall", {
		params: {name: "1"}
	})
	menus.value = result.data.data
	// console.log(menus.value)
}

onMounted(() => {
	cate()
})
const value =ref(null)
const options=[
	{
		label: "",
		value: "",
		disabled: true
	},
	]
</script>

<style scoped>

</style>