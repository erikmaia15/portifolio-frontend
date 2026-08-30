import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/public/HomeView.vue'),
    meta: { title: 'Início • Portfólio' },
  },
  {
    path: '/projetos',
    name: 'projects',
    component: () => import('@/views/public/ProjectsView.vue'),
    meta: { title: 'Projetos • Portfólio' },
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/views/admin/LoginView.vue'),
    meta: { title: 'Login • Painel Admin' },
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: () => import('@/views/admin/DashboardView.vue'),
    meta: { requiresAuth: true, title: 'Dashboard • Painel Admin' },
  },
  {
    path: '/admin/projects/novo',
    name: 'admin-project-create',
    component: () => import('@/views/admin/ProjectCreateView.vue'),
    meta: { requiresAuth: true, title: 'Novo Projeto • Painel Admin' },
  },
  {
    path: '/admin/projects/:id/editar',
    name: 'admin-project-edit',
    component: () => import('@/views/admin/ProjectEditView.vue'),
    meta: { requiresAuth: true, title: 'Editar Projeto • Painel Admin' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Página Não Encontrada • Portfólio' },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      // Se já estamos na mesma página (ex: clicou em Contato estando na Home)
      if (to.path === from.path) {
        return { el: to.hash, behavior: 'smooth' };
      }
      // Se veio de outra página (ex: de /projetos para a Home), aguarda a transição de saída (300ms)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ el: to.hash, behavior: 'smooth' });
        }, 350);
      });
    }
    return { top: 0, behavior: 'smooth' };
  },
});

router.beforeEach(async (to, _from, next) => {
  // Update document title
  if (to.meta?.title) {
    document.title = to.meta.title as string;
  }

  const authStore = useAuthStore();

  // Strict route protection: completely prevent unauthorized access
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ path: '/admin/login', query: { redirect: to.fullPath } });
  }

  // If already authenticated and trying to go to login page, redirect to dashboard
  if (to.path === '/admin/login' && authStore.isAuthenticated) {
    return next({ path: '/admin/dashboard' });
  }

  next();
});

export default router;
