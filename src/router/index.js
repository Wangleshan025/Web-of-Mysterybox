// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Collections from '../views/Collections.vue';
import Showcase from '../views/Showcase.vue';
import About from '../views/About.vue';
import BoxDetail from '../views/BoxDetail.vue';
import Profile from '../views/Profile.vue';
import Orders from '../views/Orders.vue';
import Cart from '../views/Cart.vue';
import Search from '../views/Search.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/collections', name: 'Collections', component: Collections },
  { path: '/collections/my', name: 'MyCollections', component: () => import('../views/MyCollections.vue') },
  { path: '/showcase', name: 'Showcase', component: Showcase },
  { path: '/about', name: 'About', component: About },
  { path: '/box/:id', name: 'BoxDetail', component: BoxDetail },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/orders', name: 'Orders', component: Orders },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/search', name: 'Search', component: Search },
  { path: '/news', name: 'News', component: () => import('../views/News.vue') }, // 新闻页面
  { path: '/limited', name: 'Limited', component: () => import('../views/Limited.vue') }, // 限定款页面
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFound.vue') }
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;