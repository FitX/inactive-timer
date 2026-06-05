import { createRouter, createWebHashHistory } from 'vue-router';
import PageA from './pages/PageA.vue';
import PageB from './pages/PageB.vue';
import PageC from './pages/PageC.vue';

declare module 'vue-router' {
  interface RouteMeta {
    title: string;
    logoutTimeout: number;
  }
}

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    {
      path: '/dashboard',
      component: PageA,
      meta: { title: 'Dashboard', logoutTimeout: 40 },
    },
    {
      path: '/profile',
      component: PageB,
      meta: { title: 'Profile', logoutTimeout: 30 },
    },
    {
      path: '/payment',
      component: PageC,
      meta: { title: 'Payments (sensitive)', logoutTimeout: 20 },
    },
  ],
});
