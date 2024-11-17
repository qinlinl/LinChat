import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Login from '@/views/Login.vue'
import NotFound from '@/views/404.vue'
import Friends from '@/components/Friends.vue'
import Groups from '@/components/Groups.vue'
import Test from '@/views/test.vue'
import About from '@/components/About.vue'

const routes = [
  {
    path: '/',
    component: HomeView,
    meta: { requiresAuth: true },
    children: [
      { path: 'friends', component: Friends },
      { path: 'groups', component: Groups },
      { path: 'about', component: About },
    ],
  },
  { path: '/login', component: Login },
  { path: '/test', component: Test },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token') // 从 sessionStorage 中获取 token

  // 如果路由需要身份验证且用户没有 token
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next({ path: '/login' }) // 跳转到登录页
  } else {
    next() // 继续路由
  }
})

export default router
