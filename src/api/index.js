// 封装的是具体的接口请求方法
// 每个方法只负责请求一个url地址
import request from '@/utils/request.js'
// import store from '@/store' // 拿到store对象
// 导出接口，为了在逻辑页面引用
/**
 *
 * @param {*} param0  注册接口
 * @returns
 */
export const registerAPI = ({ username, password, repassword }) => {
// 原地是一个promise对象(内部包含原生Ajax请求)
// return 这个promise对象到逻辑页面，去那边对promise对象提取结果
  return request({
    url: '/api/reg',
    method: 'POST',
    /*
      axios传参 params,data
      params的对象参数名和值，axios源码会把参数和值拼接在url?后面给后台(query 查询字符串)
      data 的对象参数名和值,axios源码会把参数和值拼接在请求体里(body参数)
    */
    // registerAPI(this.ruleForm) --- 把实参传递过来
    // registerAPI( ruleForm: { // 表单数据对象列表
    //   username: '',
    //   password: '',
    //   repassword: ''// 确认密码
    // })
    // 通过解构赋值把对应的对象结构出来 {username:'username 变量名'，..}={this.ruleForm}
    // key是传入对象key匹配 value是变量名，
    // es6规定key和value同名是，可简写key即是key也是value
    data: {
      username,
      password,
      repassword
    }
  })
}
/**
 *
 * @param {*} param0  {username,password}
 * @returns  promise对象
 */
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password
    }
  })
}
/**
 *获取用户信息接口模块
 */
export const getuserinfoAPI = () => {
  return request({
    url: '/my/userinfo'
    /*
       传参给后台：params(查询字符串 query)
          data：（请求体body）
          header(请求头)
    */
    // headers: {
    //   // this.$store.state.token 这里this 不是组件对象不能用this.$store拿到store对象
    //   Authorization: store.state.token
    // }
  })
}
/**
  * 获取左侧菜单数据
  */
export const getmenuAPI = () => {
  return request({
    url: '/my/menus'
    // headers: {
    //   Authorization: store.state.token
    // }
  })
}
/**
 *  更新用户的资料
 * @param {*} param0
 * @returns   promise对象
 */
export const updateuserinfoAPI = ({ id, username, nickname, email, user_pic }) => {
  return request({
    url: '/my/userinfo',
    data: {
      id,
      username,
      nickname,
      email,
      user_pic
    }
  })
}
/**
  * 更新用户头像的接口
  */
export const updataavatorAPI = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar // 头像base64字符串
    }
  })
}

/**
 * 更新用户密码
 *
 */
export const updatepwdPAI = ({ old_pwd, new_pwd, re_pwd }) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: {
      old_pwd,
      new_pwd,
      re_pwd
    }
  })
}

/**
 *   获取文章分类接 口
 * @returns promise对象
 */
export const getcateAPI = () => {
  return request({
    url: '/my/cate/list'
  })
}

/**
 * 增加文章文类接口
 * @param {*} param0
 * @returns  promise对象
 */
export const cateaddAPI = ({ cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/add',
    method: 'POST',
    data: {
      cate_name,
      cate_alias
    }
  })
}
/**
 *修改文章分类接口
 * @param {*} param0
 * @returns  promise对象
 */
export const updatecateinfo = ({ id, cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/info',
    method: 'PUT',
    data: {
      id,
      cate_name,
      cate_alias
    }
  })
}
/**
 * 删除文章分类项接口
 * @param {*} param0
 * @returns  promise对象
 */
export const delcateAPI = (id) => {
  return request({
    url: '/my/cate/del',
    method: 'DELETE',
    params: {
      id
    }
  })
}

/** 发布文章接口
 * @params{*} fd  FormData 表单数据对象
 * @returns
 */
export const pushartAPI = (fd) => {
  return request({
    url: '/my/article/add',
    method: 'POST',
    data: fd
    // {} 如果是一个普通的对象，axios会把他转成JSON字符串在请求体交给后台
    // 这个接口文档要求请求体里是一个FormData类型(表单数据对象)携带文件给后台
  })
}

/**
 * 获取文章列表数据
 * @param {*} param0   pagenum页码, pagesize页面的数据条数, cate_id文章分类id, state文章状态
 * @returns  promise对象
 */
export const getartlistAPI = ({ pagenum, pagesize, cate_id, state }) => {
  return request({
    url: '/my/article/list',
    params: {
      pagenum,
      pagesize,
      cate_id,
      state
    }
  })
}

/**
 * 获取文章详情接口
 * @param {*} id  文章id
 * @returns   promise对象
 */
export const getartinfoAPI = (id) => {
  return request({
    url: '/my/article/info',
    params: {
      id
    }

  })
}

/**
 *  删除文章列表接口
 * @param {*} id
 * @returns promise对象
 */
export const delartlistAPI = (id) => {
  return request({
    url: '/my/article/info',
    method: 'DELETE',
    params: {
      id
    }
  })
}
