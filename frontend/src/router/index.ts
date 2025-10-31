import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import UsuarioView from '../views/UsuarioView.vue';

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/usuarios', name: 'Usuarios', component: UsuarioView },
  { path: '/', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
