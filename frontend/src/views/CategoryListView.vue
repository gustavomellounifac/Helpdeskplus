<template>
  <div class="page">
    <div class="page-header">
      <h1>Categorias</h1>
    </div>

    <div class="card" style="margin-bottom: 1.25rem; max-width: 500px;">
      <h2 style="margin-top: 0; font-size: 1rem;">{{ editingId ? 'Editar categoria' : 'Nova categoria' }}</h2>
      <div v-if="error" class="alert alert-error">{{ error }}</div>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Nome</label>
          <input v-model="form.name" type="text" required placeholder="Ex.: Rede" />
        </div>
        <div class="form-group">
          <label>Descrição</label>
          <input v-model="form.description" type="text" placeholder="Descrição opcional" />
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-primary" type="submit">{{ editingId ? 'Salvar' : 'Adicionar' }}</button>
          <button v-if="editingId" class="btn btn-secondary" type="button" @click="resetForm">Cancelar</button>
        </div>
      </form>
    </div>

    <div class="card">
      <table class="table" v-if="categories.length">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.id">
            <td>{{ cat.name }}</td>
            <td>{{ cat.description || '—' }}</td>
            <td class="actions-cell">
              <button class="btn btn-secondary" @click="edit(cat)">Editar</button>
              <button v-if="auth.isAdmin" class="btn btn-danger" @click="remove(cat)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">Nenhuma categoria cadastrada.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '../services/api';
import { useAuthStore } from '../store/auth';

const auth = useAuthStore();
const categories = ref([]);
const editingId = ref(null);
const error = ref('');

const form = reactive({ name: '', description: '' });

function resetForm() {
  editingId.value = null;
  form.name = '';
  form.description = '';
}

function edit(cat) {
  editingId.value = cat.id;
  form.name = cat.name;
  form.description = cat.description || '';
}

async function load() {
  const { data } = await api.get('/categories');
  categories.value = data;
}

async function handleSubmit() {
  error.value = '';
  try {
    if (editingId.value) {
      await api.put(`/categories/${editingId.value}`, form);
    } else {
      await api.post('/categories', form);
    }
    resetForm();
    await load();
  } catch (err) {
    error.value = err.response?.data?.error || 'Não foi possível salvar a categoria.';
  }
}

async function remove(cat) {
  if (!confirm(`Excluir a categoria "${cat.name}"?`)) return;
  await api.delete(`/categories/${cat.id}`);
  await load();
}

onMounted(load);
</script>
