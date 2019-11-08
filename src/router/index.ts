import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Settings from '@/views/Settings.vue'
import Terminal from '@/views/terminal.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: About
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings
  },
  {
    path: '/terminal',
    name: 'terminal',
    component: Terminal
  }
]

const router = new VueRouter({
  routes
})

export default router
