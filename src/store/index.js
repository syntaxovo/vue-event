import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedstate from 'vuex-persistedstate'
import { getuserinfoAPI } from '@/api'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '', // 将token字符串保存到全局
    userinfo: {} // 用于储存用户的相关信息 id:用户id nickname:用户昵称 emai邮箱 user_pic头像
  },
  getters: {
    // username (state) {
    //   return state.userinfo
    // }
    username: state => state.userinfo.username,
    nickname: state => state.userinfo.nickname,
    user_pic: state => state.userinfo.user_pic
  },
  mutations: {
    updatatoken (state, val) { // 定义用于修改的token的方法
      state.token = val
    },
    // 定义用于更新用于信息的函数
    updataUseinfo (state, val) {
      state.userinfo = val
    }
  },
  actions: {
    // 异步请求用户信息
    async initgetuserinfo (store) {
      const res = await getuserinfoAPI()
      console.log(res)
      store.commit('updataUseinfo', res.data.data)
    }
  },
  modules: {
  },
  plugins: [
    createPersistedstate() // 注入持久化插件
  ]

})
// vuex保存在内存中，刷新所有的值会回归初始化无法做到持久化存储
// 使用vuex插件 vuex-persistedstate@3.2.1
