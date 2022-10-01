<template>
  <div class="userinfo">
      <el-card class="box-card" style="text-align:left">
        <div slot="header" class="clearfix"  >
          <span >基本资料</span>
        </div>
        <div   class="text item">
          <el-form :model="ruleForm " status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="登录名称" prop="username"  >
              <el-input    disabled v-model="ruleForm.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickname">
              <el-input   v-model="ruleForm.nickname" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户邮箱" prop="email">
              <el-input v-model.number="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">提交修改</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
        </div>
    </el-card>

  </div>
</template>
<script>
import { updateuserinfoAPI } from '@/api'
export default {
  name: 'user-info',
  data () {
    return {
      ruleForm: {
        username: this.$store.state.userinfo.username, // 默认值用vuex中存储的用户信息
        nickname: '',
        email: ''
      },
      rules: {
        // 定义验证规则
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '用户昵称必须为1-10位非空字符串', trigger: ['blur', 'change'] }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      // 提交修改
      // 再带的validate 方法用来进行兜底验证
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          // 通过
        //  console.log(this.ruleForm)
          // 接口参数中必须要携带id
          this.ruleForm.id = this.$store.state.userinfo.id
          const { data: res } = await updateuserinfoAPI(this.ruleForm)
          if (res.code !== 0) return this.$message.error('更新用户信息失败')
          this.$message.success('更新成功')
          // 让vuex重新获取最新数据
          this.$store.dispatch('initgetuserinfo')
        } else {
          // 没有通过
          return false
        }
      })
    },
    resetForm () {
      // 重置方法
      // this.ruleForm.nickname = ''
      // 使用elementui 内置的方法 既可重置信息也能重置报错信息s
      this.$refs.ruleForm.resetFields()
    }
  }

}
</script>
<style lang="less" scoped>

</style>
