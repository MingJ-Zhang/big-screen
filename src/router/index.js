/*
 * @Author: daidai
 * @Date: 2022-01-12 14:22:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-28 14:53:02
 * @FilePath: \web-pc\src\pages\big-screen\router\index.js
 */
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [{
  path: '/',
  redirect: '/index',
},
{
  path: '/home',
  name: 'home',
  component: () => import(/* webpackChunkName: "LSD.bighome" */ '../views/home.vue'),
  children: [
    {
      path: '/index',
      name: 'index',
      component: () => import(/* webpackChunkName: "LSD.bighome" */ '../views/indexs/index.vue'),
    }
  ]
},
{
  path: '/huoyandingwei',
  name: 'huoyandingwei',
  component: () => import('../views/huoyandingwei.vue')
  },
{
  path: '/qqq',
  name: 'qqq',
  component: () => import('../views/qqq.vue')
  },
{
  path: '/vocs',
  name: 'vocs',
  component: () => import('../views/vocs.vue')
},
{
  path: '/zaosheng',
  name: 'zaosheng',
  component: () => import('../views/zaosheng.vue')
},
{
  path: '/mohu',
  name: 'mohu',
  component: () => import('../views/mohu.vue')
},
{
  path: '/yasuo',
  name: 'yasuo',
  component: () => import('../views/yasuo.vue')
},
{
  path: '/liangdu',
  name: 'liangdu',
  component: () => import('../views/liangdu.vue')
},
{
  path: '/dianjingyingxiang',
  name: 'dianjingyingxiang',
  component: () => import('../views/dianjingyingxiang.vue')
},
{
  path: '/yaogan',
  name: 'yaogan',
  component: () => import('../views/yaogan.vue')
},
{
  path: '/jiancai',
  name: 'jiancai',
  component: () => import('../views/jiancai.vue')
},

];
const router = new VueRouter({
  mode: "hash",
  // base: process.env.BASE_URL,
  routes
});

export default router;