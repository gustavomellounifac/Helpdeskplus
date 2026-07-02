<template>
  <div class="auth-shell">
    <div class="auth-card">
      <h1>🎧 Criar conta</h1>
      <p class="subtitle">Cadastre-se como cliente para abrir chamados de suporte.</p>

      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Nome</label>
          <input v-model="name" type="text" required placeholder="Seu nome completo" />
        </div>
        <div class="form-group">
          <label>E-mail</label>
          <input v-model="email" type="email" required placeholder="voce@exemplo.com" />
        </div>
        <div class="form-group">
          <label>Senha</label>
          <input v-model="password" type="password" required minlength="6" placeholder="Mínimo 6 caracteres" />
        </div>
        <button class="btn btn-primary" type="submit" style="width: 100%" :disabled="loading">
          {{ loading ? 'Criando conta...' : 'Criar conta' }}
        </button>
      </form>

      <p class="auth-footer">
        Já tem conta? <router-link to="/login">Entrar</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

const name = ref('');
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
    await auth.register(name.value, email.value, password.value);
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.error || 'Não foi possível criar a conta.';
  } finally {
    loading.value = false;
  }
}
</script>
