<template>
  <div class="auth-shell">
    <div class="auth-card">
      <h1>🎧 HelpDesk+</h1>
      <p class="subtitle">Entre para acompanhar seus chamados de suporte.</p>

      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>E-mail</label>
          <input v-model="email" type="email" required autocomplete="email" placeholder="voce@exemplo.com" />
        </div>
        <div class="form-group">
          <label>Senha</label>
          <input v-model="password" type="password" required autocomplete="current-password" placeholder="••••••••" />
        </div>
        <button class="btn btn-primary" type="submit" style="width: 100%" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <p class="auth-footer">
        Ainda não tem conta? <router-link to="/register">Cadastre-se</router-link>
      </p>
      <p class="auth-footer" style="margin-top: 0.5rem; font-size: 0.78rem;">
        Teste: admin@helpdesk.com / tecnico@helpdesk.com / cliente@helpdesk.com &mdash; senha <strong>123456</strong>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const auth = useAuthStore();
const router = useRouter();

async function handleSubmit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.login(email.value, password.value);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.error || 'Não foi possível entrar. Tente novamente.';
  } finally {
    loading.value = false;
  }
}
</script>
