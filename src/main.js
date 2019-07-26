// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './httpConfig/url_config'
import ElementUI from 'element-ui'
import VueSocketio from 'vue-socket.io'
import 'font-awesome/css/font-awesome.min.css'

// import socketIo from 'socket.io-client'
Vue.use(VueSocketio, 'http://127.0.0.1:7001/')

Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.prototype.$axios = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  sockets: {
    connect: function () {
      console.log('socket connected')
      setInterval(() => {
        this.$socket.emit('heartBeat', 'beating')
        // console.log('beat')
      }, 5000)
    }
  }
})
