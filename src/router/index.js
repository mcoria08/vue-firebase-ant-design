import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../views/Home.vue';
import EditarView from '../views/Editar.vue';
import LoginView from '../views/Login.vue';
import RegisterView from '../views/Register.vue';

import { useUserStore } from '../stores/userStore.js';

const requireAuth = async(to, from, next) => {
  const userStore = useUserStore();
  userStore.loadingSession = true;

  const user = await userStore.currentUser();
  if (user) {
    next();
  }else{
    next('/login');
  }
  userStore.loadingSession = false;
};

const routes = [
  { path: '/', component: HomeView, beforeEnter: requireAuth, name: 'home' },
  { path: '/editar/:id', component: EditarView, name: 'editar'  },
  { path: '/login', component: LoginView, name: 'login'  },
  { path: '/register', component: RegisterView, name: 'register'  },
];

const router = createRouter({
  routes,
  history: createWebHistory()
});

export default router;