// 封装的是具体的接口请求方法
// 每个方法只负责请求一个url地址
import request from '@/utils/request.js'
// 导出接口，为了在逻辑页面引用
export const registerAPI = () => {
// 原地是一个promise对象(内部包含原生Ajax请求)
// return 这个promise对象到逻辑页面，去那边对promise对象提取结果
  return request({
    url: '/api/reg',
    method: 'POSt',
    data: {
      username: 'admin',
      password: 'rnm123',
      repassword: 'rnm123'
    }
  })
}
