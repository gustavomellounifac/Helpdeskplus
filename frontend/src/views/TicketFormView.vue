<template>
  <div class="page">
    <div class="page-header">
      <h1>{{ isEdit ? 'Editar chamado' : 'Novo chamado' }}</h1>
    </div>

    <div class="card" style="max-width: 640px;">
      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Título</label>
          <input v-model="form.title" type="text" required placeholder="Resuma o problema" />
        </div>

        <div class="form-group">
          <label>Descrição</label>
          <textarea v-model="form.description" required rows="5" placeholder="Descreva o problema em detalhes"></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Categoria</label>
            <select v-model="form.categoryId">
              <option :value="null">Sem categoria</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>

          <div class="form-group" v-if="auth.canManage">
            <label>Prioridade</label>
            <select v-model="form.priority">
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>
        </div>

        <div class="form-row" v-if="isEdit && auth.canManage">
          <div class="form-group">
            <label>Status</label>
            <select v-model="form.status">
              <option value="aberto">Aberto</option>
              <option value="em_andamento">Em andamento</option>
              <option value="resolvido">Resolvido</option>
              <option value="fechado">Fechado</option>
            </select>
          </div>

          <div class="form-group">
            <label>Atribuir a técnico</label>
            <select v-model="form.assignedToId">
              <option :value="null">Não atribuído</option>
              <option v-for="tec in technicians" :key="tec.id" :value="tec.id">{{ tec.name }}</option>
            </select>
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
          <button class="btn btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Salvando...' : 'Salvar' }}
          </button>
          <router-link to="/tickets" class="btn btn-secondary">Cancelar</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';
import { useAuthStore } from '../store/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const isEdit = computed(() => !!route.params.id);
const error = ref('');
const loading = ref(false);
const categories = ref([]);
const technicians = ref([]);

const form = reactive({
  title: '',
  description: '',
  categoryId: null,
  priority: 'media',
  status: 'aberto',
  assignedToId: null,
});

async function loadCategories() {
  const { data } = await api.get('/categories');
  categories.value = data;
}

async function loadTechnicians() {
  if (!auth.canManage) return;
  const { data } = await api.get('/users');
  technicians.value = data.filter((u) => u.role === 'tecnico');
}

async function loadTicket() {
  if (!isEdit.value) return;
  const { data } = await api.get(`/tickets/${route.params.id}`);
  form.title = data.title;
  form.description = data.description;
  form.categoryId = data.categoryId;
  form.priority = data.priority;
  form.status = data.status;
  form.assignedToId = data.assignedToId;
}

async function handleSubmit() {
  error.value = '';
  loading.value = true;
  try {
    if (isEdit.value) {
      await api.put(`/tickets/${route.params.id}`, form);
    } else {
      await api.post('/tickets', form);
    }
    router.push('/tickets');
  } catch (err) {
    error.value = err.response?.data?.error || 'Não foi possível salvar o chamado.';
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await Promise.all([loadCategories(), loadTechnicians(), loadTicket()]);
});
</script>
