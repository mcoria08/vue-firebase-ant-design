import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../views/Home.vue';
import EditarView from '../views/Editar.vue';
import LoginView from '../views/Login.vue';
import RegisterView from '../views/Register.vue';
import PerfilView from '../views/Perfil.vue';
import NotFoundView from '../views/NotFound.vue';

import { useUserStore } from '../stores/userStore.js';
import { useDatabaseStore } from '../stores/databaseStore.js';

import NotFound from "../views/NotFound.vue";

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

const redirectUrl = async (to, from, next) => {
  const databaseStore = useDatabaseStore();
  const userStore = useUserStore();
  userStore.loadingSession = true;

  const nameUrl = await databaseStore.getUrl(to.params.pathMatch[0]);
  if(!nameUrl){
    next();
    userStore.loadingSession = false;
  } else {
    window.location.href = nameUrl;
    userStore.loadingSession = true;
    next();
  }
};

const routes = [
  { path: '/', component: HomeView, beforeEnter: requireAuth, name: 'home' },
  { path: '/perfil', component: PerfilView, beforeEnter: requireAuth, name: 'perfil'  },
  { path: '/editar/:id', component: EditarView, name: 'editar'  },
  { path: '/login', component: LoginView, name: 'login'  },
  { path: '/register', component: RegisterView, name: 'register'  },
  { path: '/:pathMatch(.*)*', component: NotFoundView, beforeEnter: redirectUrl, name: '404'  },
];

const router = createRouter({
  routes,
  history: createWebHistory()
});

export default router;