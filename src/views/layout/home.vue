<template>
  <el-container>
    <el-header class="header-container">
<!-- 头部组件 -->
      <div class="left-header">
        <span><img src="@/assets/images/logo.png" alt=""></span>
      </div>
      <div class="right-header">
        <span><img src="@/assets/images/tou.jpg" alt=""></span>
  <el-menu  class="tag-menu"  :default-active="activeIndex" mode="horizontal" @select="handleSelect"  background-color="#770077"
  text-color="#fff"
  active-text-color="#770077">
    <el-submenu  index="1">
      <template slot="title">个人中心</template>
      <el-menu-item index="2-1">选项1</el-menu-item>
      <el-menu-item index="2-2">选项2</el-menu-item>
      <el-menu-item index="2-3">选项3</el-menu-item>
   </el-submenu>
  </el-menu>
  <i class="el-icon-menu" ></i>
  <el-button type="text" @click="open" style="color:#fff;margin-left: 3px;">退出</el-button>
  </div>
  </el-header>
    <el-container style="height:100vh" >
      <el-aside width="200px" class="aside-menu">
        <!-- 侧边栏 -->
        <div class="aside-header">
          <!-- 侧边栏头部 -->
          <span class="pic">
             <img :src= 'user_pic'    v-if="user_pic">
             <img src="@/assets/images/tou.jpg" v-else />
          </span>
           欢迎{{nickname || username}}
          <!-- 昵称或用户名 -->
        </div>
        <!-- 侧边栏菜单列表 -->
        <el-menu
      default-active="$route.path"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#770077"
      text-color="#fff"
      unique-opened
      router
      active-text-color="#ffd04b">
      <template v-for="item in menus"  >
      <el-menu-item v-if="!item.children" :index="item.indexPath"
      :key="item.indexPath">
        <i :class="item.icon"></i>
        <span slot="title">{{item.title}}</span>
      </el-menu-item>
      <el-submenu v-else  :index="item.indexPath" :key="item.indexPath+'1'">
        <template slot="title">
          <i class="item.icon"></i>
          <span style="font-size=14px">{{item.title}}</span>
        </template>
          <el-menu-item   v-for="obj,index in item.children" :index="obj.indexPath"  :key="index">
            <i class="obj.icon"></i>
          <span style="font-size=10px">{{obj.title}}</span>
          </el-menu-item>
      </el-submenu>
      </template>
    </el-menu>
      </el-aside>
      <el-container>
        <!-- 主体区域 -->
        <el-main >
          <router-view></router-view>
        </el-main>
        <el-footer class="foot-menu">
          <h3>https://github.com/syntaxovo --yjq</h3>
        </el-footer>
      </el-container>
    </el-container>
</el-container>

</template>
<script>
import { mapGetters } from 'vuex'
import { getmenuAPI } from '@/api'
export default {
  name: 'My-home',
  data () {
    return {
      activeIndex: '1',
      menus: [] // 用来存储请求的菜单数据
    }
  },
  // 在组件标签上绑定的所有事件都是自定义事件(包括原生事件的名字click、input)
  // 都需要 $emit来触发
  // 如果组件内不支持这个原生事件名字 解决：@时间名.native='methods里的方法'
  // .native给组件内跟标签绑定这个原生的事件
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    },
    open () {
      this.$confirm('此操作将退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认退出 清除token 跳转到login
        this.$store.commit('updatatoken', '')
        this.$store.commit(' updataUseinfo', {})
        this.$router.push('/login')
      }).catch(() => {
        // 取消

      })
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    async getmenuactions (store) {
      const { data: res } = await getmenuAPI()
      console.log(res)
      this.menus = res.data
    }
  },
  created () {
    // 请求侧边栏数据
    this.getmenuactions()
  },
  computed: {
    ...mapGetters(['user_pic', 'nickname', 'username'])
  }
}
</script>
<style lang="less" scoped>
.header-container{
  display: flex;
  width: 100%;

  justify-content:space-between;
  align-self: center;
  background-color:#770077;
  .right-header{
    display: flex;
    align-self: center;
    justify-content: space-between;
    img{
      width: 35px;
      height: 35px;
      margin-top: 10px;
      border-radius: 23px;
      text-align: center;
      line-height: 35px;
    }
    .tag-menu{
      background-color: #770077;
    }
    .el-icon-menu{
      line-height: 61px;
    }

  }
}
.aside-menu{
  height:100vh ;
  background-color: #008888;

    .aside-header{
      height: 50px;
      display: flex;
      align-items: center;
     justify-content: space-evenly;
      .pic{
      img{
      width: 50px;
      height: 50px;
      border-radius: 50px;
      &:nth-child(1){
        width: 50px;
      }
      }

      }

  .el-menu-vertical-demo{
    height: 100vh;
  }
    }

}
.foot-menu{
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 80px;
  font-size: 14px;
  align-items: center;
  background: #FFF0F5 ;
}
</style>
