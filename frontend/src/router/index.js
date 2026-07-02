import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import DashboardView from '../views/DashboardView.vue';
import TicketListView from '../views/TicketListView.vue';
import TicketFormView from '../views/TicketFormView.vue';
import TicketDetailView from '../views/TicketDetailView.vue';
import CategoryListView from '../views/CategoryListView.vue';
import UserListView from '../views/UserListView.vue';

const routes = [
  { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
  { path: '/register', name: 'register', component: RegisterView, meta: { public: true } },
  { path: '/', name: 'dashboard', component: DashboardView },
  { path: '/tickets', name: 'tickets', component: TicketListView },
  { path: '/tickets/novo', name: 'ticket-new', component: TicketFormView },
  { path: '/tickets/:id', name: 'ticket-detail', component: TicketDetailView, props: true },
  { path: '/tickets/:id/editar', name: 'ticket-edit', component: TicketFormView, props: true },
  { path: '/categorias', name: 'categories', component: CategoryListView, meta: { roles: ['admin', 'tecnico'] } },
  { path: '/usuarios', name: 'users', component: UserListView, meta: { roles: ['admin'] } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();

  if (!to.meta.public && !auth.isAuthenticated) {
    return { name: 'login' };
  }

  if (to.meta.roles && !to.meta.roles.includes(auth.user?.role)) {
    return { name: 'dashboard' };
  }

  if (to.meta.public && auth.isAuthenticated) {
    return { name: 'dashboard' };
  }

  return true;
});

export default router;
