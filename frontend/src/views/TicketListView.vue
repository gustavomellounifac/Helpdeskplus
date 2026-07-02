<template>
  <div class="page">
    <div class="page-header">
      <h1>Chamados</h1>
      <router-link to="/tickets/novo" class="btn btn-primary">+ Novo chamado</router-link>
    </div>

    <div class="card">
      <div class="form-row" style="margin-bottom: 1.25rem;">
        <div class="form-group">
          <label>Filtrar por status</label>
          <select v-model="statusFilter">
            <option value="">Todos</option>
            <option value="aberto">Aberto</option>
            <option value="em_andamento">Em andamento</option>
            <option value="resolvido">Resolvido</option>
            <option value="fechado">Fechado</option>
          </select>
        </div>
      </div>

      <table class="table" v-if="filteredTickets.length">
        <thead>
          <tr>
            <th>Título</th>
            <th>Categoria</th>
            <th>Solicitante</th>
            <th>Status</th>
            <th>Prioridade</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in filteredTickets" :key="ticket.id">
            <td>{{ ticket.title }}</td>
            <td>{{ ticket.category?.name || '—' }}</td>
            <td>{{ ticket.requester?.name || '—' }}</td>
            <td><span class="badge" :class="`badge-${ticket.status}`">{{ statusLabel(ticket.status) }}</span></td>
            <td><span class="badge" :class="`badge-${ticket.priority}`">{{ priorityLabel(ticket.priority) }}</span></td>
            <td class="actions-cell">
              <router-link :to="`/tickets/${ticket.id}`" class="btn btn-secondary">Ver</router-link>
              <button class="btn btn-danger" @click="remove(ticket)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">Nenhum chamado encontrado.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api';

const tickets = ref([]);
const statusFilter = ref('');

const statusLabels = { aberto: 'Aberto', em_andamento: 'Em andamento', resolvido: 'Resolvido', fechado: 'Fechado' };
const priorityLabels = { baixa: 'Baixa', media: 'Média', alta: 'Alta' };
const statusLabel = (s) => statusLabels[s] || s;
const priorityLabel = (p) => priorityLabels[p] || p;

const filteredTickets = computed(() =>
  statusFilter.value ? tickets.value.filter((t) => t.status === statusFilter.value) : tickets.value
);

async function load() {
  const { data } = await api.get('/tickets');
  tickets.value = data;
}

async function remove(ticket) {
  if (!confirm(`Excluir o chamado "${ticket.title}"?`)) return;
  await api.delete(`/tickets/${ticket.id}`);
  await load();
}

onMounted(load);
</script>
