import Vue from 'vue'
import Router from 'vue-router'
import welcome from '@/pages/welcome'
import chat from '@/pages/chat'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: welcome
    },
    {
      path: '/chat',
      name: 'chat',
      component: chat
    }
  ]
})
