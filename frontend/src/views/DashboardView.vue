<template>
  <div class="page">
    <div class="page-header">
      <h1>Dashboard</h1>
      <router-link to="/tickets/novo" class="btn btn-primary">+ Novo chamado</router-link>
    </div>

    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">Total de chamados</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.aberto }}</div>
        <div class="stat-label">Abertos</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.em_andamento }}</div>
        <div class="stat-label">Em andamento</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.resolvido + stats.fechado }}</div>
        <div class="stat-label">Concluídos</div>
      </div>
    </div>

    <div class="card">
      <h2 style="margin-top: 0; font-size: 1.05rem;">Chamados recentes</h2>
      <table class="table" v-if="recentTickets.length">
        <thead>
          <tr>
            <th>Título</th>
            <th>Status</th>
            <th>Prioridade</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in recentTickets" :key="ticket.id">
            <td>{{ ticket.title }}</td>
            <td><span class="badge" :class="`badge-${ticket.status}`">{{ statusLabel(ticket.status) }}</span></td>
            <td><span class="badge" :class="`badge-${ticket.priority}`">{{ priorityLabel(ticket.priority) }}</span></td>
            <td><router-link :to="`/tickets/${ticket.id}`" class="btn btn-secondary">Ver</router-link></td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">Nenhum chamado encontrado ainda.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api';

const tickets = ref([]);

const stats = computed(() => {
  const base = { total: tickets.value.length, aberto: 0, em_andamento: 0, resolvido: 0, fechado: 0 };
  tickets.value.forEach((t) => { base[t.status] = (base[t.status] || 0) + 1; });
  return base;
});

const recentTickets = computed(() => tickets.value.slice(0, 5));

const statusLabels = { aberto: 'Aberto', em_andamento: 'Em andamento', resolvido: 'Resolvido', fechado: 'Fechado' };
const priorityLabels = { baixa: 'Baixa', media: 'Média', alta: 'Alta' };
const statusLabel = (s) => statusLabels[s] || s;
const priorityLabel = (p) => priorityLabels[p] || p;

onMounted(async () => {
  const { data } = await api.get('/tickets');
  tickets.value = data;
});
</script>
