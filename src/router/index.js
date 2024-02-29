import { createRouter, createWebHistory } from 'vue-router'
import { ElNotification } from "element-plus";
import { h } from "vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component:()=> import("../views/Login.vue")
    },
    {
      path: '/test',
      name: 'test',
      component:()=> import("../views/test.vue")
    },
    {
      path: '/',
      redirect: '/login'
    },

    {
      path: "/",
      name: 'home',
      component: ()=> import('../views/Home.vue'),
      children: [
        {
          path: 'user',
          name: "user",
          component: ()=> import("../views/user.vue")
        },
        {
          path: 'goods',
          name: "goods",
          component: ()=> import("../views/goods.vue")
        },
        {
          path: 'order',
          name: "order",
          component: ()=> import("../views/order.vue")
        },
        {
          path: '/review',
          name: 'review',
          component: () => import("../views/review.vue")
        }
      ]
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   const isLogin = localStorage.getItem('isLogin') === 'true'; // 检查登录状态
//   if (to.path !== '/login' && !isLogin) {
//     // 如果未登录且尝试访问非登录页面，则阻止跳转并提示用户
//     ElNotification({
//       title: '跳转失败',
//       message: h('i', { style: 'color: teal' }, '请先登录'),
//     })
//     next('/login'); // 可以将用户重定向到登录页或其他页面
//   } else {
//     next(); // 如果已登录或访问的是登录页面，则允许跳转
//   }
// });

export default router
