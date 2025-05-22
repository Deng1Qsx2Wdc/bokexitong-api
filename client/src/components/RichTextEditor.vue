<script setup>
import {ref, reactive, inject, shallowRef,onMounted,onBeforeUnmount} from "vue";
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
const server_url = inject("server_url")

// 编辑器实例，必须用 shallowRef，重要！


// 内容 HTML
const valueHtml = ref("");

// // 模拟 ajax 异步获取内容
// onMounted(() => {
// 	setTimeout(() => {
// 		valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>';
// 	}, 1500);
// });

const emit = defineEmits(["content-update"])//defineEmits 声明组件可触发的事件

const toolbarConfig = {

};
const mode =ref('default')

const editorRef = shallowRef()
const editorConfig = { placeholder: '请输入内容...' };
editorConfig.MENU_CONF ={}
editorConfig.MENU_CONF['uploadImage'] = {
	// 上传图片的配置
	base64LimitSize:10 * 1024,//10kb
	server: 'http://localhost:8080/upload/editor_upload',
}
const  customParseImageSrc =(src)=>{
	console.log(src)
		if(src.indexOf("http")!=0){
			console.log(src)
			const url ="http://localhost:8080"+src
			console.log(url)

			return url
		}
		return src
}
const coutParseImageSrc =(imageNode)=> {
	if (imageNode == null) return
	console.log(imageNode)
	const { src, alt, url, href } = imageNode
	console.log('inserted image', src, alt, url, href)
}
editorConfig.MENU_CONF['insertImage'] = {
	parseImageSrc: customParseImageSrc,
	onInsertedImage:coutParseImageSrc
		// checkImage: customCheckImageFn,

}
// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
	const editor = editorRef.value;
	if (editor == null) return;

	editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
	// console.log('created', editor);
	editorRef.value = editor; // 记录 editor 实例，重要！
};

const handleDestroyed = (editor) => {
	// console.log('destroyed', editor);
};
const handleChange =(editor)=>{
	// console.log(valueHtml.value)
	emit('content-update',editor.getText())//emit()
	console.log(editor.getText());
}
const customPaste = (editor, event, callback) => {
	console.log('ClipboardEvent 粘贴事件对象', event);

	// 自定义插入内容
	// editor.insertText('xxx');

	// 返回值（注意，vue 事件的返回值，不能用 return）
	// callback(false); // 返回 false ，阻止默认粘贴行为
	callback(true) // 返回 true ，继续默认的粘贴行为
};
</script>

<template>
<div>
	<div style="border: 1px solid #ccc; margin-top: 10px">
		<Toolbar
				:editor="editorRef"
				:defaultConfig="toolbarConfig"
				:mode="mode"
				style="border-bottom: 1px solid #ccc"
		/>
		<!--				:editor 将工具栏绑定到编辑器实例（editorRef）-->
		<!--				:defaultConfig 配置工具栏的默认行为和显示内容。-->
		<!--				:mode 设置工具栏的显示模式，通常为 'default'（完整模式）或 'simple'（简洁模式）-->
		<Editor
				:defaultConfig="editorConfig"
				:mode="mode"
				v-model="valueHtml"
				style="height: 400px; overflow-y: hidden"
				@onCreated="handleCreated"
				@onChange = "handleChange"
				@onDestroyed="handleDestroyed"
				@customPaste="customPaste"
		/>
		<!--				v-model 实现编辑器内容的 双向绑定，valueHtml 是 Vue 组件的响应式变量，存储编辑器的 HTML 内容-->
		<!--				@onFocus="handleFocus"-->
		<!--				@onBlur="handleBlur"-->

		<!--				@onCreated（编辑器初始化完成时触发，通常用于获取编辑器实例）-->
		<!--				@onChange（编辑器内容变化时触发，用于实时保存或校验内容）-->
		<!--		        @onDestroyed（编辑器销毁时触发，用于清理资源）-->
		<!--				@onFocus / @onBlur（焦点状态）-->
		<!--				@customPaste（自定义粘贴行为）-->
		<!--				@customAlert（自定义提示）-->
	</div>
</div>
</template>


<style scoped>

</style>