import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/login',
    component: () => import('@/views/Login')
    // webpack提供 import 函数的路由懒加载导入组件
    // 页面路径切换到对应地址，才去加载对应组件代码
    // 让首页加载文件体积更新，打开更快

  }, {
    path: '/res',
    component: () => import('@/views/Register')

  }, {
    path: '/home',
    component: () => import('@/views/layout/home.vue'),
    children: [
      // 左侧侧边栏点击切换路由，规则于其一致
      {
        path: '/home',
        component: () => import('@/views/home/index.vue')
      },
      {
        path: '/user-info',
        component: () => import('@/views/home/userinfo.vue')
      }, {
        path: '/user-avatar',
        component: () => import('@/views/home/avator.vue')
      }, {
        path: '/user-pwd',
        component: () => import('@/views/home/userpwd.vue')
      }, {
        path: '/art-cate',
        component: () => import('@/views/home/article/artCate.vue')
      }, {
        path: '/art-list',
        component: () => import('@/views/home/article/artlist.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
const whitelist = ['/login', '/res']
// 准备一个白名单 无需登录即可访问路由地址
// 存在token证明登录了，无则无法登录
router.beforeEach((to, form, next) => {
//  console.log(1)
/*
    全局前置守卫
    next如果强制切换路由跳转地址会再次走路由守卫再次去匹配路由表
*/
  const token = store.state.token
  if (token) {
    if (!store.state.userinfo.username) {
      // 存在tokne再去发请求
      store.dispatch('initgetuserinfo')
    }
    next()
  } else {
    // 未登录
    // includes (值) 判断值是否在数组里出现返回true
    if (whitelist.includes(to.path)) {
      // 为登录可以访问的路由地址，则放性
      next()
    } else { next('/login') }
  }
})
export default router
/*
  退出登录，重新登录只走相应的组件代码（异步dom切换）不会导致所有组件执行 app组件不渲染
  //换个账号也应该获取信息
  // 解决在登录页 1，登录成功后发请求去拿用户信息
  //2在全局前置守卫中写(路由跳转的时候判断+获取)
*/
