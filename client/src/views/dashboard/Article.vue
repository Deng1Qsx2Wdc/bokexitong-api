<script setup>
import {ref,reactive,inject} from "vue";
import {AdminStore} from "@/stores/AdminStore.js";

const axios = inject("axios")
const adminStore = AdminStore()

import { useRouter,useRoute} from "vue-router";
const router = useRouter()
const route = useRoute()
</script>

<template>
	<div  style="display: flex; min-width: 0;">
		<n-table :bordered="false" :single-line="false">
			<thead>
			<tr>
				<th>Abandon</th>
				<th>Abnormal</th>
				<th>Abolish</th>
				<th>...</th>
				<th>万事开头难</th>
			</tr>
			</thead>
			<tbody>
			<tr>
				<td>放弃</td>
				<td>反常的</td>
				<td>彻底废除</td>
				<td>...</td>
				<td>干！我刚才背的是啥</td>
			</tr>

			</tbody>
		</n-table>
	</div>
</template>

<style scoped>

</style>