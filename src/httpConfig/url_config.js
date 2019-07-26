/**
 * ajax请求配置
 */
import axios from 'axios'
import router from '../router/index.js'

// axios默认配置
axios.defaults.timeout = 50000 // 超时时间
// axios.defaults.baseURL = 'http://193.112.82.110:8000/';  // 默认地址
axios.defaults.baseURL = 'http://localhost:7001' // 默认地址

// 整理数据
axios.defaults.transformRequest = function (data) {
  data = JSON.stringify(data)
  return data
}

// 路由请求拦截
// http request 拦截器
axios.interceptors.request.use(
  config => {
    // config.data = JSON.stringify(config.data);
    config.headers['Content-Type'] = 'application/json;charset=UTF-8'

    // if (cookie.get("token")) {
    //   //用户每次操作，都将cookie设置成2小时
    //   cookie.set("token",cookie.get("token") ,1/12);
    //   cookie.set("name",cookie.get("name") ,1/12);
    //   config.headers.token = cookie.get("token");
    //   config.headers.name= cookie.get("name");

    if (localStorage.token) {
      config.headers.Authorization = 'Bearer ' + localStorage.token
    }
    return config
  },
  error => {
    return Promise.reject(error.response)
  })

// 路由响应拦截
// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // error.header("Access-Control-Allow-Origin", "*");
    if (error.response) {
      switch (error.response.status) {
        case 401:
          router.currentRoute.path !== 'login' &&
          router.replace({
            path: 'login',
            query: { redirect: router.currentRoute.path }
          })
      }
    }
    console.log(JSON.stringify(error))
    return Promise.reject(error.response) // 返回接口返回的错误信息
  })
export default axios
