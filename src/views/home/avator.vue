<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img class="the_img" v-if="!this.avatar" src="../../assets/images/avatar.jpg" alt="" />
      <img class="the_img" v-else :src="this.avatar" alt="">

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input type="file" accept="image/*" style="display: none" ref="iptRef" @change="onFileChange" />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''"
          @click="upload"
        >上传头像</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { updataavatorAPI } from '@/api'
export default {
  name: 'my-avatar',
  data () {
    return {
      avatar: ''
    }
  },
  methods: {
    chooseImg () {
      // 选择图片--点击事件
      // 目的：为了让input[type= file] 标签，让它再用js代码来触发它的点击事件
      // 导致它默认行为给一个文件选择窗口
      // 原因：input[type files] 是原生标签样式不太好改
      this.$refs.iptRef.click() // 触发它的点击事件
    },
    onFileChange (e) { // e 原生事件对象
      // 确认改变
      const files = e.target.files// 拿到用户选择的文件数组
      if (files.length === 0) {
      // 证明刚刚文件选择窗口打开了，但是它一个文件都没有选择然后点击了确认关闭弹窗
      } else {
        console.log(files[0])
        /*
        目标：选择的图片文件，交给img标签上做纯前端的预览
        img的标签的src 值
        只能是图片的链接地址 (外链的http://开头，图片文件相对路径)
        或者是图片的base64字符串(而且字符串还必须是data.image/pag;abse64,图片转64字符)
        解决：1 文件转内存地址 只能在js里内存里不能发给后台
                url.createObjecturl(文件)
                返回值：内存临时地址
        */
        // this.avatar = URL.createObjectURL(files[0])
        /*
        方案2 ：文件->base64字符串（此字符串是可以发给后台）
        */
        const fr = new FileReader()
        fr.readAsDataURL(files[0]) // 传入文件对象开始读
        fr.onload = (e) => { // onload 等待把文件读成base64位字符串后触发load事件函数
          // e.target.result的值就是读完的结果
          this.avatar = e.target.result
        }
      }
    },
    async upload () {
      // 上传头像
      const { data: res } = await updataavatorAPI(this.avatar)
      // console.log(res)
      if (res.code !== 0) return this.$message.error(res.message)
      // 更新成功
      this.$message.success(res.message)
      // 让vuex里的actions重新获取数据
      this.$store.dispatch('initgetuserinfo')
    }
  }
}
</script>
<style lang="less" scoped>
.the_img{
  width: 350px;
  height: 350px;
}
</style>
