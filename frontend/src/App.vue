<template>
  <div class="app-shell">
    <nav v-if="auth.isAuthenticated" class="navbar">
      <router-link to="/" class="navbar-brand">🎧 HelpDesk+</router-link>
      <div class="navbar-links">
        <router-link to="/">Dashboard</router-link>
        <router-link to="/tickets">Chamados</router-link>
        <router-link v-if="auth.canManage" to="/categorias">Categorias</router-link>
        <router-link v-if="auth.isAdmin" to="/usuarios">Usuários</router-link>
      </div>
      <div class="navbar-user">
        <span>{{ auth.user?.name }} · <strong>{{ roleLabel }}</strong></span>
        <button class="btn btn-ghost" @click="handleLogout">Sair</button>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './store/auth';

const auth = useAuthStore();
const router = useRouter();

const roleLabels = { admin: 'Admin', tecnico: 'Técnico', cliente: 'Cliente' };
const roleLabel = computed(() => roleLabels[auth.user?.role] || '');

function handleLogout() {
  auth.logout();
  router.push('/login');
}
</script>
