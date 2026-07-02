<template>
  <div class="page" v-if="ticket">
    <div class="page-header">
      <h1>{{ ticket.title }}</h1>
      <div style="display: flex; gap: 0.5rem;">
        <router-link :to="`/tickets/${ticket.id}/editar`" class="btn btn-secondary">Editar</router-link>
        <router-link to="/tickets" class="btn btn-secondary">Voltar</router-link>
      </div>
    </div>

    <div class="card" style="margin-bottom: 1.25rem;">
      <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
        <span class="badge" :class="`badge-${ticket.status}`">{{ statusLabel(ticket.status) }}</span>
        <span class="badge" :class="`badge-${ticket.priority}`">Prioridade {{ priorityLabel(ticket.priority) }}</span>
      </div>

      <p style="white-space: pre-wrap;">{{ ticket.description }}</p>

      <div class="form-row" style="margin-top: 1.25rem; font-size: 0.88rem; color: var(--color-text-muted);">
        <div><strong>Categoria:</strong> {{ ticket.category?.name || '—' }}</div>
        <div><strong>Solicitante:</strong> {{ ticket.requester?.name || '—' }}</div>
        <div><strong>Técnico responsável:</strong> {{ ticket.assignedTo?.name || 'Não atribuído' }}</div>
      </div>
    </div>

    <div class="card">
      <h2 style="margin-top: 0; font-size: 1.05rem;">Comentários</h2>

      <div v-if="ticket.comments?.length">
        <div class="comment" v-for="comment in ticket.comments" :key="comment.id">
          <div class="comment-header">
            <span class="comment-author">{{ comment.author?.name }}</span>
            <span>{{ formatDate(comment.createdAt) }}</span>
          </div>
          <p style="margin: 0;">{{ comment.message }}</p>
        </div>
      </div>
      <div v-else class="empty-state" style="padding: 1.5rem 1rem;">Nenhum comentário ainda.</div>

      <form @submit.prevent="addComment" style="margin-top: 1rem; display: flex; gap: 0.5rem;">
        <input v-model="newComment" type="text" placeholder="Escreva um comentário..." style="flex: 1; padding: 0.6rem 0.75rem; border: 1px solid var(--color-border); border-radius: 6px;" required />
        <button class="btn btn-primary" type="submit">Enviar</button>
      </form>
    </div>
  </div>
  <div v-else class="page">
    <p>Carregando...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';

const route = useRoute();
const ticket = ref(null);
const newComment = ref('');

const statusLabels = { aberto: 'Aberto', em_andamento: 'Em andamento', resolvido: 'Resolvido', fechado: 'Fechado' };
const priorityLabels = { baixa: 'Baixa', media: 'Média', alta: 'Alta' };
const statusLabel = (s) => statusLabels[s] || s;
const priorityLabel = (p) => priorityLabels[p] || p;

function formatDate(value) {
  return new Date(value).toLocaleString('pt-BR');
}

async function load() {
  const { data } = await api.get(`/tickets/${route.params.id}`);
  ticket.value = data;
}

async function addComment() {
  if (!newComment.value.trim()) return;
  await api.post(`/tickets/${route.params.id}/comments`, { message: newComment.value });
  newComment.value = '';
  await load();
}

onMounted(load);
</script>
