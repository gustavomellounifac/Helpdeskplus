<template>
  <div class="page">
    <div class="page-header">
      <h1>Usuários</h1>
    </div>

    <div class="card" style="margin-bottom: 1.25rem; max-width: 500px;">
      <h2 style="margin-top: 0; font-size: 1rem;">{{ editingId ? 'Editar usuário' : 'Novo usuário' }}</h2>
      <div v-if="error" class="alert alert-error">{{ error }}</div>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Nome</label>
          <input v-model="form.name" type="text" required />
        </div>
        <div class="form-group">
          <label>E-mail</label>
          <input v-model="form.email" type="email" required />
        </div>
        <div class="form-group">
          <label>{{ editingId ? 'Nova senha (opcional)' : 'Senha' }}</label>
          <input v-model="form.password" type="password" :required="!editingId" minlength="6" />
        </div>
        <div class="form-group">
          <label>Perfil</label>
          <select v-model="form.role">
            <option value="cliente">Cliente</option>
            <option value="tecnico">Técnico</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-primary" type="submit">{{ editingId ? 'Salvar' : 'Adicionar' }}</button>
          <button v-if="editingId" class="btn btn-secondary" type="button" @click="resetForm">Cancelar</button>
        </div>
      </form>
    </div>

    <div class="card">
      <table class="table" v-if="users.length">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Perfil</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td><span class="badge" :class="`badge-${user.role}`">{{ roleLabel(user.role) }}</span></td>
            <td class="actions-cell">
              <button class="btn btn-secondary" @click="edit(user)">Editar</button>
              <button class="btn btn-danger" @click="remove(user)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">Nenhum usuário cadastrado.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../services/api';

const users = ref([]);
const editingId = ref(null);
const error = ref('');

const form = reactive({ name: '', email: '', password: '', role: 'cliente' });

const roleLabels = { admin: 'Admin', tecnico: 'Técnico', cliente: 'Cliente' };
const roleLabel = (r) => roleLabels[r] || r;

function resetForm() {
  editingId.value = null;
  form.name = '';
  form.email = '';
  form.password = '';
  form.role = 'cliente';
}

function edit(user) {
  editingId.value = user.id;
  form.name = user.name;
  form.email = user.email;
  form.password = '';
  form.role = user.role;
}

async function load() {
  const { data } = await api.get('/users');
  users.value = data;
}

async function handleSubmit() {
  error.value = '';
  try {
    if (editingId.value) {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      await api.put(`/users/${editingId.value}`, payload);
    } else {
      await api.post('/users', form);
    }
    resetForm();
    await load();
  } catch (err) {
    error.value = err.response?.data?.error || 'Não foi possível salvar o usuário.';
  }
}

async function remove(user) {
  if (!confirm(`Excluir o usuário "${user.name}"?`)) return;
  await api.delete(`/users/${user.id}`);
  await load();
}

onMounted(load);
</script>
