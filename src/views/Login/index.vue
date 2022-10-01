<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 登录盒子 -->
      <span class="login-title">
        <img src="@/assets/images/login_title.png" alt="">
      </span>
      <!-- 注册盒子对应表单区域 -->
      <el-form :model="ruleForm"  :rules="rules" ref="ruleForm"  class="demo-ruleForm">
        <el-form-item   prop="username">
          <el-input   v-model="ruleForm.username"  placeholder="请输入用户名"></el-input>
        </el-form-item>
          <el-form-item prop="password" >
            <el-input  type="password" placeholder="请输入密码" v-model="ruleForm.password" ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  class="login-sub" @click="loginfn">登录</el-button>
            <el-link type="info" @click="$router.push('/res')">去注册</el-link>
          </el-form-item>
    </el-form>
    </div>
  </div>
</template>
<script>
import { loginAPI } from '@/api'
import { mapMutations } from 'vuex'
export default {
  name: 'MyRes',
  /*
    前端绑定数据对象属性名，可以直接给要调用的功能接口的参数名一致
    好处：可以直接把前端对象（带着同名的属性和前端值）发送给后台
  */
  data () {
    return {
      ruleForm: { // 表单数据对象列表
        username: '',
        password: ''
      },
      rules: { // 表单规则校验对象
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: '用户名必须是1-10的大小写字母数字',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            // 匹配规则
            pattern: /^\S{6,15}$/,
            message: '密码必须是6-10位非空字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['updatatoken']),
    loginfn () {
      // 登录的兜底验证
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          // 通过验证
          // console.log(this.ruleForm)
          const { data: res } = await loginAPI(this.ruleForm)
          // console.log(res)
          if (res.code !== 0) {
            // 登录失败
            this.$message.error(res.message)
          } else {
            this.$message.success(res.message)// 登录成功 ，并存储token令牌
            this.updatatoken(res.token)
            this.$router.push('/home')
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container{
height: 100vh;
background-image: url('@/assets/images/login_bg.jpg');
display: flex;
justify-content: center;
align-items: center;
.login-box{
  width: 400px;
  height: 335px;
  border-radius: 3px;
  box-sizing: border-box;
  background-color: #fff;
  padding: 0 30px;
.login-title{
  height: 60px;
  line-height: 60px;
  }
.login-sub{
  width: 100%;
}
}
}
</style>
