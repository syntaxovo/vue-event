<template>
 <div>
  <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>文章分类</span>
    <el-button style="float: right; padding: 3px 0" type="text"  @click="addcateshowdialog">添加分类</el-button>
  </div>
  <!-- 列表预览 -->
  <el-table
    :data="articlemenu"
    stripe
    style="width: 100%">
    <!-- type是table-colomun内置的属性，告诉它用index即第一个单元格用索引值 -->
    <el-table-column
    type="index"
      prop="date"
      label="序号"
      width="180">
    </el-table-column>
    <el-table-column
      prop="cate_name"
      label="分类名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="cate_alias"
      label="分类别名">
    </el-table-column>
    <el-table-column
      prop="address"
      label="操作">
      <!-- scope 对象：{row ：行对象} -->
      <template v-slot="scope">
        <el-button type="primary" size="mini" @click="updatecate(scope.row)">修改</el-button>
        <el-button type="danger" size="mini" @click="delfn(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</el-card>
<!-- el-dialog 对话框
    title: 左上角标题
    visible：对话框显示隐藏
    .sync 类似于v-model 可以赋予组件实现 “双向数据绑定”
    父组件变量要传给子组件，子组件传出的值也要自定=动绑定到夫组件变量
    v-model 本质:给所在标签绑定 ：value=Vue变量 @input='val =>val变量 =val'
  vue2中一个标签上v-model只能用一次，vue3可多次
  .sync 本质：给所在标签绑定 ：props 属性名=“vue变量”
  before-close：对话框关闭前的回调
  -->
<el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  @close="dialogclearfn"
  width="30%"
   >

  <!-- 相关信息表单 -->
  <el-form :model="addForm" status-icon :rules="addRules" ref="addRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="分类名称" prop="cate_name">
    <el-input   v-model="addForm.cate_name" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="分类别名" prop="cate_alias">
    <el-input   v-model="addForm.cate_alias" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="cancelfn" >取消</el-button>
    <el-button @click="confirmfn">确定</el-button>
  </el-form-item>
</el-form>
</el-dialog>

 </div>
</template>
<script>
/*
 如果用同一个按钮想要做状态区分
 1 定义一个标记变量 isEdit,还要定义本次要编辑的数据唯一id值 editId
 2 在点击修改的时候，isEdit 改为true editid保存要修改的数据id
 3 在点击新增按钮的时候，isedit改为false editid制空
 4 在点击保存(确定)按钮的时候，就可以用isEdit 变量做区分
 */
import { getcateAPI, cateaddAPI, updatecateinfo, delcateAPI } from '@/api'
export default {
  name: 'My-Article',
  data () {
    return {
      articlemenu: [], // 定义文章数据列表
      dialogVisible: false, // 对话窗的显示隐藏
      addForm: {
        // 添加表单的数据对象
        cate_name: '',
        cate_alias: ''
      },
      addRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,15}$/, message: '密码长度必须是1-15位的非空字符串', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      },
      isEdit: false, // 默认新增 true为新增状态
      editid: ''// 保存正在要编辑的数据id值
    }
  },
  created () {
    // 获取文章列表数据方法
    this.getcateAPIfn()
  },
  methods: {
    addcateshowdialog () {
      // 弹出对话框
      this.isEdit = false // 变为新增状态标记
      this.editid = ''
      this.dialogVisible = true
    },
    // 获取文章列表数据
    async  getcateAPIfn () {
      const { data: res } = await getcateAPI()
      // console.log(res)
      this.articlemenu = res.data
    },
    dialogclearfn () {
      // 表单关闭时候清空表单内容
      this.$refs.addRef.resetFields()
      // this.addForm.cate_alias = ''
      // this.addForm.cate_name = ''
    },
    cancelfn () {
      // 取消
      this.dialogVisible = false
    },
    confirmfn () {
      // 确认添加 进行兜底验证
      this.$refs.addRef.validate(async vaild => {
        if (vaild) {
          if (this.editid) {
            // 要修改,需要添加id属性
            // this.addForm.id = this.editid // 把要编辑的文章分类 添加到对象上
            const { data: res } = await updatecateinfo({ id: this.editid, ...this.addForm })
            // console.log(res)
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
          } else {
            // 要新增
            const { data: res } = await cateaddAPI(this.addForm)
            // console.log(res)
            if (res.code !== 0) return this.$message.error(res.message)
            // 在此调用更新文章列表的方法重新渲染
            this.$message.success(res.message)
          }
          this.getcateAPIfn()
          this.dialogVisible = false
        } else {
          return false
        }
      })
      this.dialogVisible = false
    },
    updatecate (obj) {
      // 修改分类按钮
      // console.log(obj)
      // obj的值{ id,cate_name,cate_alias}
      // 出现弹窗然后数据回显
      this.dialogVisible = true
      this.editid = obj.id
      // 让 el-dialog 第一次挂载el-form时，先用addform空字符串初始值绑定到内部，后续用做resetFields重置
      // 所以让真实DOM先创建并在内部绑定复制好初始化值
      // 接着我们真实DOM更新绑定好，在给数据回填
      this.$nextTick(() => {
        // 数据回填
        this.addForm.cate_name = obj.cate_name
        this.addForm.cate_alias = obj.cate_alias
      })
    },
    async delfn (obj) {
    // 删除对应的文章分类项
      const { data: res } = await delcateAPI(obj.id)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 删除后在重新渲染页面
      this.getcateAPIfn()
    }
  }
}
// 第一次打开网页，先点击修改再点击新增，输入框存在值
// 原因：点击修改后，关闭对话框的时候，置空失效了
</script>
<style lang="less" scoped>

</style>
