<template>
  <div>
  <!-- 内容区域 -->
<el-card class="box-card">
  <div slot="header" class="clearfix" style="text-align: left;">
    <span>文章分类</span>
  </div>
  <!-- 搜索取悦 -->
  <el-form :inline="true" :model="listForm" class="demo-form-inline">
  <el-form-item label="文章分类" prop="cate_id">
    <el-select
      v-model="listForm.cate_id"
      placeholder="请选择分类"
      size="small"
    >
    <el-option v-for="obj in articlelist" :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="发布状态" >
    <el-select v-model="listForm.state" placeholder="请选择状态" size="small">
    <el-option label="已发布" value="已发布"></el-option>
    <el-option label="草稿" value="草稿"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="choosefn">筛选</el-button>
    <el-button type="info" @click="resetfn">重置</el-button>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="showdialogfn">发表文章</el-button>
  </el-form-item>
</el-form>
<!-- 文章表格区域 -->
<el-table :data="artlist" style="width:100%" border stripe>
  <el-table-column label="文章标题" prop="title">
    <template v-slot="scope">
      <el-link @click="getartinfo(scope.row.id)">{{scope.row.title}}</el-link>
    </template>
  </el-table-column>
  <el-table-column label="分类" prop="cate_name"></el-table-column>
  <el-table-column label="发表时间" prop="pub_date">
    <template v-slot="scope">
      <span> {{$formatDate(scope.row.pub_date)}}</span>
    </template>
  </el-table-column>
  <el-table-column label="状态" prop="state"></el-table-column>
  <el-table-column label="操作" >
    <template v-slot="{row}">
      <div>
        <el-button type="primary" @click="dellist(row.id)">删除</el-button>
      </div>
    </template>
  </el-table-column>

</el-table>
<!-- 分页区域 -->
<el-pagination
  @size-change="handlesizechangefn"
  @current-change="handlepagechangefn"
  :current-page.sync="listForm.pagenum"
  :page-sizes="[2,3,5,10]"
  :page-size.sync="listForm.pagesize"
  layout="total,sizes,prev,pager,next,jumper"
  :total="total">
</el-pagination>
</el-card>
<!-- 发表文章的Dialog对话框 -->
<el-dialog
  title="发表文章"
  :visible.sync="dialogVisible"
  width="50%"
  fullscreen
  :before-close="handleClose"
  @close="dialogClosefn">
<!-- 发布文章的对话框 -->
<el-form :model="pubForm" status-icon :rules="pubrules" ref="pubForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="文章标题" prop="title">
    <el-input  v-model="pubForm.title" placeholder="请输入标题" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="文章分类" prop="cate_id">
    <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="100%">
      <el-option v-for=" obj in  articlelist" :key="obj.id" :label="obj.cate_name" :value="obj.id "></el-option>
  </el-select>
  </el-form-item>
  <el-form-item label="文章内容" prop="content">
    <!-- 富文本编译器 -->
    <quill-editor v-model="pubForm.content" @change="contentchange"></quill-editor>
  </el-form-item>
  <!-- 封面选择 -->
  <el-form-item label="封面选择" prop="cover_img">
    <!-- 用来显示封面的图片 -->
    <img src="@/assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef">
    <br/>
    <!-- 文件封面的选择按钮，原生的样式难以更改，所以先隐藏在添加一个按钮来触发其点击事件 -->
    <input type="file"
    style="display:none"
     accept="image/*"
     ref="iptFileRef"
    @change='changeCoverfn' />
    <!-- 选择封面的按钮 -->
    <el-button type="text" @click="selcover">+选择封面 </el-button>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="pubArticlefn('已发布')">发布</el-button>
    <el-button type="info"  @click="pubArticlefn('草稿')">存为草稿</el-button>
  </el-form-item>
</el-form>
</el-dialog>
<!-- 查看文章详情对话框 -->
<el-dialog
  title="提示"
  :visible.sync="dialogVisible2"
  width="30%"
  :before-close="handleClose">
 <h1 class="title"> {{artDetail.title}}</h1>
<div class="info">
  <span>作者：{{artDetail.nickname ||artDetail.username}}</span>
  <span>发布时间：{{$formatDate(artDetail.pub_date) }}</span>
  <span>所属分类：{{artDetail.cate_name}}</span>
  <span>状态：{{artDetail.state}}</span>
</div>
<!-- 分割线 -->
<el-divider></el-divider>
<!-- 文章的封面 -->
<!--
  组件在被创建时，会用data里的默认值，让template里标签先渲染一次
  你的网络请求数据回来，data里的变量发生了变化，会让template里使用此变量的地方再次更新dom
  问题：第一次渲染的时候无值可能会导致报错，但是效果出来了
  解决 使用v-if先不让template里会报错的代码屏蔽执行
 -->
<img  v-if="artDetail.cover_img" alt="" :src=" baseURLR+ artDetail.cover_img"/>
<!-- 文章的详情 -->
<div class="detail-box" v-html="artDetail.content"> </div>
</el-dialog>
</div>
</template>
<script>
// 标签和样式中，引入图片文件可以写路径，在js里引入图片要用import引入
// webpack 会把图片变为一个base64字符串/在打包后图片的临时地址
/*
    标签和样式中，引入图片文件直接写  ' 静态路径'（把路径放在js的vue变量里在赋值是不行的 ）
    打包的时候，会分析文件的大小,小兔转换为base64字符串在赋予src，如果是大图拷贝图片换个路径给img的src显示(运行时)
*/
import { getcateAPI, pushartAPI, getartlistAPI, getartinfoAPI, delartlistAPI } from '@/api'
import imgobj from '@/assets/images/cover.jpg'
import { baseURL } from '@/utils/request.js'
export default {
  name: 'My-Artlist',
  data () {
    return {
      baseURLR: baseURL,
      listForm: {
        // 查询参数对象
        pagenum: 1, // 默认拿第一页的数据
        pagesize: 2, // 每页的数据条数
        cate_id: '', // 列表分类
        state: '' // 列表状态
      },
      pubForm: {
        // 发布文章弹出框数据对象
        title: '',
        cate_id: '', // 类别
        content: '', // 文本编译器内容
        cover_img: '', // 封面文件
        state: ''// 发布状态 已发布，草稿
      },
      articlelist: [], // 保存文章分类列表
      artlist: [], // 保存文章列表
      total: 0, // 保存现有文章的总数
      dialogVisible: false, // 发布文章对话框显示与隐藏
      dialogVisible2: false, // 用与查看文章详情的对话框
      pubrules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题长度为1-30个字符' }
        ],
        cate_id: [
          { required: true, message: '请输入文章类别', trigger: 'change' }
        ],
        content: [
          // content对应quill-editor富文本选择器，它不是el提供表单标签
          // el-input 等输入框的blur 事件时进行校验
          // 下拉菜单，单选框，复选框，是在change事件时进行校验
          // quill-editor2个事件都没有，所以你输入内容也不会自动走校验
          /*
            解决：自己来给quill-editor绑定chnage事件
            在el-form组件中，调用某个校验规则在重新执行
          */
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        cover_img: [
          { required: true, message: '请选择封面', trigger: 'blur' }
        ]
      },
      artDetail: {}// 文章详情
    }
  },
  created () {
    // 调用获取文章分类接口方法
    this.getarticlelist()
    // 调用获取文章列表方法
    this.getlistdate()
  },
  methods: {
    // 发布文章对话框关闭前的回调
    handleClose (done) { // done调用就会放行关闭对话框
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    /*
    $confirm 内部虽然是一个确认提示框，但是他借用了Promise语法来管理，点击确定它的状态为兑现
    成功状态返回'confirm' 如果用户点击了取消按钮，此promise对象状态为拒绝状态
    返回 'cancel' 字符串
    只能拿到成功的结果，如果失败内部会向浏览器控制台抛出错误并不会往下执行
    捕获错误的的对象：1 try catch
                      2 用promise的链式调用
    */
    showdialogfn () {
      // 发表文章按钮的点击事件让对话框弹出
      this.dialogVisible = true
    },
    async  getarticlelist () {
      // 获取文章分类接口
      const { data: res } = await getcateAPI()
      console.log(res)
      this.articlelist = res.data
    },
    selcover () {
      // 选择封面的方法，让文件选择窗口出现先获取标签对象
      this.$refs.iptFileRef.click() // 用js来模拟一次点击事件
    },
    changeCoverfn (e) {
      // 用户选择了封面文件
      // e.target 拿到触发事件的那个标签 (input 标签对象本身)
      // e.target.files 拿到选择的文件数组
      const files = e.target.files
      if (files.length === 0) {
        // 用户没有选择图片
        this.pubForm.cover_img = null
        // img 要显示回默认cover.png
        this.$refs.imgRef.setAttribute('src', imgobj)
      } else {
        // 用户选择了图片，把文件直接保存到表单对象的属性
        this.pubForm.cover_img = files[0]
        // 把图片文件，要显示到img 标签里
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
        // 让表单单独走校验规则
        this.$refs.pubForm.validateField('cover_img')
      }
    },
    // 表单里点击发布/存为草稿
    pubArticlefn (str) {
      // str 值：'已发布' 或者''草稿'（后端要求的参数值）
      this.pubForm.state = str // 统一保存到表单对象上
      // 进行兜底验证
      this.$refs.pubForm.validate(async valid => {
        if (valid) {
          // 通过验证
          console.log(this.pubForm)
          const fd = new FormData()
          // 准备一个表单数据对象的容器，FormData类是HTML5新出的专门为了装文件内容和其他
          // 参数的一个容器 fd.append('参数名'，值)
          fd.append('title', this.pubForm.title)
          fd.append('cate_id', this.pubForm.cate_id)
          fd.append('content', this.pubForm.content)
          fd.append('cover_img', this.pubForm.cover_img)
          fd.append('state', this.pubForm.state)
          const { data: res } = await pushartAPI(fd)
          // console.log(res)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          // 关闭对话框
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    contentchange () {
      // 富文本编译器change事件
      this.$refs.pubForm.validateField('content')
    },
    dialogClosefn () {
      // 新增文章->对话框关闭时->清空表单
      this.$refs.pubForm.resetFields()
      // 我们需要手动给封面标签img 重新设置一个值，因为没有收到v-model影响
      this.$refs.imgRef.setAttribute('src', imgobj)
    },
    async getlistdate () {
      // 获取文章列表数据
      const { data: res } = await getartlistAPI(this.listForm)
      this.artlist = res.data// 保存当前获取的文章列表(有分页不是所有数据)
      this.total = res.total// 保存总数
    },
    handlesizechangefn (sizes) {
      // 分页，每页条数改变时触发
      // 核心：根据选择的页数/条数，影响listform对象对应属性值，在重新发送一次请求
      // 在 Pagination的标签上已经加了.sync,子组件内会双向绑定到vue变量上
      // 不放心可再写一遍

      this.getlistdate()
    },
    handlepagechangefn (nowPage) {
      // nowPage当前要看的第几页，页数
      /*
      问题：先点击最后一个页码，切换每页显示条数2-3总数不够，每页只能分到2
      每页条数改变了，页码从3到2页发生了改变，2个事件都会触发
      偶发性bug：有时候自动回到第二页有数据有时候没有
      2个网络请求一起发，谁先回来不一定
      原因：当切换每页显示的条数，我们就当前页码设置为1，而且标签里要current
      */

      this.getlistdate()
    },
    choosefn () {
      // 有了筛选条件，点击让页码回归1，每页的条数回归2
      this.listForm.pagenum = 1
      this.listForm.pagesize = 2
      // 再次请求接口重新渲染数据
      this.getlistdate()
    },
    resetfn () {
      // 重置按钮
      this.listForm.pagenum = 1
      this.listForm.pageSize = 2
      this.listForm.cate_id = ''
      this.listForm.state = ''// 对象改变，v-model关联的表单标签也会变为空
    },
    async getartinfo (artid) {
      // 获取列表详情的接口
      const { data: res } = await getartinfoAPI(artid)
      console.log(res)
      this.artDetail = res.data
      this.dialogVisible2 = true
    },
    async dellist (artid) {
      // 删除列表数据
      const { data: res } = await delartlistAPI(artid)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      if (this.pagenum === 1) {
        /*
          在最后一页，删除最后一条时，虽然页码能回到上一页，但是数据没有出现
          原因：发现network参数lisForm.pagenum的值不会自己回到上一页，因为代码没有修改过这个listForm.pagenum值
          只是用getlistdate方法重新请求了所以没参数
        */
        if (this.listForm.length === 1) { // 保证pagenum最小值为1
          this.listForm.pagenum--
        }
      }
      // 并重新渲染列表页
      this.getlistdate()
    }
  }
}
</script>

  <!--
      通过input[type=file] 让用户选择文件，通过事件对象.target.files拿到用户选择的‘文件对象’
      预览：img标签的src属性值(base64字符串/图片链接地址)
      情况一：文件转为图片base64字符串：new FileReader()
          给src属性赋予base64字符串（图片转为base64字符串），特点一data:img/png:bse64开头

      情况二：文件转为图片链接地址：url.createObjURL(文件)

      需求：把用户选择的文件发给后台保存到服务器上
      情况一：文件转成图片base64字符串，传递给后台
      情况二：用 new FormData() 表单数据直接封装文件本身，直接传递给后台
 -->
<style lang="less" scoped>
  /*
    scoped 属性： 让style里的选择器，只能选中当前组件的标签
    原理：webpack 打包时，会给组件标签上添加相同的data-v-hash值，然后也会给所有选择器后
    加上一个 [data-v-index class='my_a']
    选择器变成 [data-v- index]
  只会给当前组件的所有原生标签添加data--v-hash值属性，还会给组件内根标签添加，而组件内标签不会被添加
  解决  提供了一个 ::v-deep 的样式语法，可以把属性选择器被自动添加到左侧
  */
.demo-form-inline{
  display: flex;
  justify-content: space-between;

}

//富文本编译器美化
 ::v-deep .ql-editor{
  min-width: 300px;
  min-height: 300px;
}
.cover-img{
  width: 400px;
  height: 280px;
  object-fit: cover;
}

</style>>
