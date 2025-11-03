import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../modules/dashboard/DashboardView.vue';
import ProdutoView from '../modules/produtos/ProdutoView.vue';
import EstoqueView from '../modules/estoque/EstoqueView.vue';
import UsuarioView from '../modules/usuarios/UsuarioView.vue';
import { AuthService } from '../services/authService';

const routes = [
  { 
    path: '/login', 
    name: 'Login', 
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: () => import('../modules/dashboard/components/DashboardKpis.vue') },
      { path: 'produtos', name: 'Produtos', component: ProdutoView },
      { path: 'historico-estoque', name: 'HistoricoEstoque', component: EstoqueView },
      { path: 'usuarios', name: 'Usuarios', component: UsuarioView }
    ]
  },
  { path: '/', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = AuthService.isAuthenticated();

  if (requiresAuth && !isAuthenticated) {

    console.warn('Acesso negado, redirecionando para login');
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {

    next('/dashboard');
  } else {
    next();
  }
});

export default router;
