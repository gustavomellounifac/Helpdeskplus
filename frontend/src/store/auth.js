import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('helpdesk_token') || null,
    user: JSON.parse(localStorage.getItem('helpdesk_user') || 'null'),
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    isTecnico: (state) => state.user?.role === 'tecnico',
    isCliente: (state) => state.user?.role === 'cliente',
    canManage: (state) => state.user?.role === 'admin' || state.user?.role === 'tecnico',
  },
  actions: {
    async login(email, password) {
      const { data } = await api.post('/auth/login', { email, password });
      this.setSession(data.token, data.user);
    },
    async register(name, email, password) {
      const { data } = await api.post('/auth/register', { name, email, password });
      this.setSession(data.token, data.user);
    },
    setSession(token, user) {
      this.token = token;
      this.user = user;
      localStorage.setItem('helpdesk_token', token);
      localStorage.setItem('helpdesk_user', JSON.stringify(user));
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('helpdesk_token');
      localStorage.removeItem('helpdesk_user');
    },
  },
});
