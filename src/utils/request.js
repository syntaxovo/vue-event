// 基于axios封装网络请求的参数
import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
// axios.create()创建一个带配置项的自定义axios函数
// myAxios请求的时候，地址baseUrl+url，然后请求参数
export const baseURL = 'http://big-event-vue-api-t.itheima.net'
const myAxios = axios.create({
  baseURL: baseURL
})
// 定义请求拦截器
myAxios.interceptors.request.use(function (config) {
  // console.log(config)
  // config配置对象（要请求后台的参数都在这个对象上）
  // 在请求前会触发一次
  // 它返回给axios内源代码，config配置对象（要请求后台的参数都在这个对象上）
  /*
    判断，登录和注册页面，vuex里无token而且登录接口和注册接口也不需要携带token
      */
  if (store.state.token) { config.headers.Authorization = store.state.token }

  return config // rerurn 交给axios 源码，根据配置项发起请求
}, function (error) {
  // 请求发起的代码，如果异常报错进入这里
  // 返回一个拒绝状态的promise对象(axios 留在此地的promise对象状态就为失败结果为error变量值)
  // 此函数类似 catch函数
  // 口诀： return非promise对象值，会作为成功的结果，返回下一个promise对象(axios留在原地)
  return Promise.reject(error)
  // 等同return new promise((resolve,reject)=>{
  //  reject(error)
//    })
})
// 定义axios 相应拦截器
myAxios.interceptors.response.use(function (response) {
  // 相应http状态码为2xx 3xx 触发成功的回调，形参中的response是成功的解果s
  return response
}, function (error) {
  console.dir(error)
  // 相应http状态码为4xx 5xx 触发失败的回调，形参中的response是失败的结果
  if (error.response.status === 401) {
    // 本次相应是token过期 要清除vuex的一切，然后回到登录页面
    store.commit('updatatoken', '')
    store.commit('updataUseinfo', {})
    Message.error('用户信息已过期')
    router.push('/login')
  }
  return Promise.reject(error)
})
// 导出axios自定义函数
export default myAxios
