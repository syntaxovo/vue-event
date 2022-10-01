import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueQuillEditor from 'vue-quill-editor' // 引入富文本编译器
// 基于dayjs封装一个全局函数来格式化时间(任意的组件可以直接来使用$formatDate)
import dayjs from 'dayjs'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css'
Vue.prototype.$formatDate = (dateObj) => {
  return dayjs(dateObj).format('YYYY-MM-DD HH-mm-ss')
} // for bubble theme

Vue.use(VueQuillEditor /* { default global options } */)
// 此方法内会用vue.commponent注册quill[editor]名字为全局组件
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
/*
  后端返回图片链接地址经验：
  为何后端返回图片地址是半截的
  原因：因为服务器的域名可能会来回变换，所以数据库里的地址只有相对路径
  要求：前端请求此图片的时候，后端会告诉你图片文件真身所在的服务器域名，前端自己拼接前缀
*/
