# HelpDesk+ 🎧

MVP de sistema web de **chamados de suporte técnico (helpdesk)**, desenvolvido como projeto acadêmico.
Permite que clientes abram chamados, técnicos os atendam e administradores gerenciem usuários e categorias.

## Arquitetura

Projeto com **frontend e backend separados**, comunicando-se via API REST (JSON + JWT):

```
trabalho/
├── backend/     # API REST em Node.js + Express + Sequelize + MySQL
└── frontend/    # SPA em Vue 3 + Vite, consome a API via Axios
```

- **Backend**: Node.js, Express, Sequelize (ORM), MySQL, JWT para autenticação, bcrypt para senhas.
- **Frontend**: Vue 3 (Composition API), Vite, Vue Router, Pinia (estado de autenticação), Axios.
- **Banco de dados**: MySQL (relacional), com 4 tabelas principais: `users`, `categories`, `tickets`, `comments`.
- **Layout**: interface própria com identidade visual coesa ao tema de suporte técnico (tons de azul/teal, badges de status/prioridade).

## Perfis de usuário

| Perfil | Permissões |
|---|---|
| **Cliente** | Cria e acompanha os próprios chamados, comenta neles. |
| **Técnico** | Vê todos os chamados, atualiza status/prioridade, atribui-se a chamados, gerencia categorias. |
| **Admin** | Tudo do técnico + CRUD completo de usuários e exclusão de categorias. |

## CRUD por área

- **Usuários** (admin): criar, listar, editar, excluir.
- **Categorias** (admin/técnico): criar, listar, editar, excluir.
- **Chamados** (todos, com regras por papel): criar, listar, editar, excluir.
- **Comentários** (todos, dentro de um chamado): criar, listar, editar, excluir.

## Como rodar

### Pré-requisitos
- Node.js 18+
- MySQL rodando localmente (ou acessível via rede)

### 1. Banco de dados

Crie o banco no MySQL:

```sql
CREATE DATABASE helpdesk;
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# edite o .env com as credenciais do seu MySQL
npm run seed   # cria as tabelas e usuários de teste
npm run dev    # inicia a API em http://localhost:3333
```

Usuários de teste criados pelo seed (senha `123456`):
- `admin@helpdesk.com` — administrador
- `tecnico@helpdesk.com` — técnico
- `cliente@helpdesk.com` — cliente

### 3. Frontend

Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env   # já aponta para http://localhost:3333/api
npm run dev             # inicia em http://localhost:5173
```

## Principais rotas da API

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Cadastro público (perfil cliente) |
| POST | `/api/auth/login` | Login, retorna JWT |
| GET | `/api/tickets` | Lista chamados (filtrado por papel) |
| POST | `/api/tickets` | Cria chamado |
| PUT/DELETE | `/api/tickets/:id` | Edita/exclui chamado |
| GET/POST | `/api/tickets/:ticketId/comments` | Lista/cria comentários do chamado |
| CRUD | `/api/categories` | Categorias de chamados |
| CRUD | `/api/users` | Usuários (somente admin) |
