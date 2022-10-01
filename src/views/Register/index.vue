<template>
  <div class="res-container">
    <div class="res-box">
      <!-- 注册盒子 -->
      <span class="res-title">
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
          <el-form-item prop="repassword">
            <el-input  type="password" placeholder="请确认密码" v-model="ruleForm.repassword"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  class="res-sub" @click="ressubmit">提交</el-button>
            <el-link type="info" @click="gologin">去登录</el-link>
          </el-form-item>
    </el-form>
    </div>
  </div>
</template>
<script>
import { registerAPI } from '@/api'
export default {
  name: 'MyRes',
  /*
    前端绑定数据对象属性名，可以直接给要调用的功能接口的参数名一致
    好处：可以直接把前端对象（带着同名的属性和前端值）发送给后台
  */
  data () {
    // 此自定义规则需要拿到输入的密码与确认密码来进行判断，所以写在data中
    const samePwdfn = (rule, value, callback) => {
      if (value !== this.ruleForm.password) {
        // 验证失败指定一Error对象
        return callback(new Error('两次输入的密码不一致'))
      } else {
        // 验证成功则直接调用即可
        callback()
      }
    }
    return {
      ruleForm: { // 表单数据对象列表
        username: '',
        password: '',
        repassword: ''// 确认密码
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
        ],
        repassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          {
            // 匹配规则
            pattern: /^\S{6,15}$/,
            message: '密码必须是6-10位非空字符',
            trigger: 'blur'
          },
          { // 自定义匹配规则
            validator: samePwdfn, trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    ressubmit () {
      // js兜底校验，防止直接进行去登录    validate方法
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          // 通过校验拿到数据
          // console.log(this.ruleForm)
          const { data: res } = await registerAPI(this.ruleForm) // 调用接口把输入的所有表单发送给后台返回 一个promise实例对象
          // console.log(res)
          // elementui在vue上添加了弹窗属性，$message
          // return 阻止代码往下执行
          if (res.code !== 0) return this.$message.error(res.message)
          // 注册成功
          this.$message.success(res.message)
          // 跳转到登录页面
          this.$router.push('/login')
        } else {
          return false // 阻止默认提交行为 (出现红色提示)
        }
      })
    },
    gologin () {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.res-container{
height: 100vh;
background-image: url('@/assets/images/login_bg.jpg');
display: flex;
justify-content: center;
align-items: center;
.res-box{
  width: 400px;
  height: 335px;
  border-radius: 3px;
  box-sizing: border-box;
  background-color: #fff;
  padding: 0 30px;
.res-title{
  height: 60px;
  line-height: 60px;
  }
.res-sub{
  width: 100%;
}
}
}
</style>
