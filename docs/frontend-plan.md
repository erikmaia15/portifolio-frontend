# Plano de Implementação — Frontend Vue 3

> Documento de referência para o desenvolvimento do frontend do portfólio.
> Backend: NestJS + Prisma + PostgreSQL

---

## Endpoints disponíveis no Backend

Base URL em desenvolvimento: `http://localhost:3000/api`

### 🔐 Auth — `/api/auth`

| Método | Rota           | Autenticação | Descrição                         | Request Body                        | Response                  |
|--------|----------------|--------------|-----------------------------------|-------------------------------------|---------------------------|
| POST   | `/auth/login`  | Pública      | Faz login, retorna JWT            | `{ email, password }`               | `{ access_token: string }` |
| GET    | `/auth/me`     | JWT Bearer   | Retorna dados do admin logado     | —                                   | `{ id, email }`           |

**Exemplo de login:**
```json
// POST /api/auth/login
// Body:
{
  "email": "admin@email.com",
  "password": "senha123"
}

// Response 200:
{
  "access_token": "eyJhbGc..."
}
```

---

### 📁 Projects — `/api/projects`

| Método | Rota              | Autenticação | Descrição                         | Request Body                                                    | Response                |
|--------|-------------------|--------------|-----------------------------------|-----------------------------------------------------------------|-------------------------|
| GET    | `/projects`       | Pública      | Lista todos os projetos ordenados | —                                                               | `Project[]`             |
| GET    | `/projects/:id`   | Pública      | Detalhe de um projeto             | —                                                               | `Project`               |
| POST   | `/projects`       | JWT Bearer   | Cria um novo projeto              | `{ name, description, imageUrl, projectUrl, order? }`           | `Project`               |
| PATCH  | `/projects/:id`   | JWT Bearer   | Edita parcialmente um projeto     | `{ name?, description?, imageUrl?, projectUrl?, order? }`       | `Project`               |
| DELETE | `/projects/:id`   | JWT Bearer   | Remove um projeto                 | —                                                               | `Project`               |

**Schema do objeto `Project`:**
```ts
interface Project {
  id: string;          // UUID
  name: string;
  description: string;
  imageUrl: string;    // URL válida
  projectUrl: string;  // URL válida
  order: number;       // Ordem de exibição (0 = primeiro)
  createdAt: string;   // ISO 8601
  updatedAt: string;   // ISO 8601
}
```

**Exemplo de criação:**
```json
// POST /api/projects
// Headers: Authorization: Bearer <token>
// Body:
{
  "name": "Portfólio Pessoal",
  "description": "Site de portfólio com Vue 3 e NestJS",
  "imageUrl": "https://exemplo.com/imagem.png",
  "projectUrl": "https://github.com/eu/portifolio",
  "order": 1
}
```

---

## Stack Frontend

- **Framework**: Vue 3 com `<script setup lang="ts">`
- **Bundler**: Vite
- **Roteamento**: Vue Router 4
- **Estado global**: Pinia
- **HTTP**: Axios (com instância configurada + interceptor de JWT)
- **UI**: TailwindCSS

---

## Variável de ambiente (`.env`)

```env
VITE_API_URL=http://localhost:3000/api
```

---

## Estrutura de pastas

```
frontend/
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── router/
│   │   └── index.ts           → rotas + navigation guard (requiresAuth)
│   ├── stores/
│   │   ├── auth.store.ts      → token, login(), logout(), isAuthenticated
│   │   └── projects.store.ts  → lista, CRUD actions
│   ├── services/
│   │   └── api.ts             → instância axios + interceptor JWT
│   ├── types/
│   │   └── project.ts         → interface Project
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.vue
│   │   │   └── AdminSidebar.vue
│   │   ├── project/
│   │   │   ├── ProjectCard.vue
│   │   │   ├── ProjectGrid.vue
│   │   │   └── ProjectForm.vue
│   │   └── ui/
│   │       ├── BaseButton.vue
│   │       ├── BaseInput.vue
│   │       └── ConfirmDialog.vue
│   └── views/
│       ├── public/
│       │   ├── HomeView.vue       → hero + sobre + preview de projetos
│       │   └── ProjectsView.vue   → grid completo
│       └── admin/
│           ├── LoginView.vue
│           ├── DashboardView.vue
│           ├── ProjectCreateView.vue
│           └── ProjectEditView.vue
```

---

## Mapeamento: View → Endpoint

| View / Componente       | Endpoint chamado                        | Store         |
|-------------------------|-----------------------------------------|---------------|
| `HomeView.vue`          | `GET /projects` (limit 3)               | projects.store |
| `ProjectsView.vue`      | `GET /projects`                         | projects.store |
| `LoginView.vue`         | `POST /auth/login`                      | auth.store    |
| `DashboardView.vue`     | `GET /projects` + `DELETE /projects/:id`| projects.store |
| `ProjectCreateView.vue` | `POST /projects`                        | projects.store |
| `ProjectEditView.vue`   | `GET /projects/:id` + `PATCH /projects/:id` | projects.store |

---

## Axios — `services/api.ts`

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:3000/api
});

// Adiciona token automaticamente em toda requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

---

## Auth Store — `stores/auth.store.ts`

```ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    token.value = data.access_token;
    localStorage.setItem('token', data.access_token);
  }

  function logout() {
    token.value = null;
    localStorage.removeItem('token');
  }

  const isAuthenticated = computed(() => !!token.value);

  return { token, login, logout, isAuthenticated };
});
```

---

## Rotas — `router/index.ts`

```ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const routes = [
  { path: '/', component: () => import('@/views/public/HomeView.vue') },
  { path: '/projetos', component: () => import('@/views/public/ProjectsView.vue') },
  { path: '/admin/login', component: () => import('@/views/admin/LoginView.vue') },
  {
    path: '/admin/dashboard',
    component: () => import('@/views/admin/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/projects/novo',
    component: () => import('@/views/admin/ProjectCreateView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/projects/:id/editar',
    component: () => import('@/views/admin/ProjectEditView.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/admin/login';
  }
});

export default router;
```

---

## Ordem de implementação sugerida

1. Setup Vite + Vue 3 + Tailwind + Vue Router + Pinia
2. `services/api.ts` — instância Axios
3. `types/project.ts` — interface
4. `ProjectsView.vue` — consumir `GET /api/projects` (testar integração com backend)
5. `auth.store.ts` + `LoginView.vue` — fluxo de autenticação
6. `DashboardView.vue` — listar + excluir projetos (admin)
7. `ProjectForm.vue` + `ProjectCreateView` + `ProjectEditView`
8. Componentes de UI: `BaseButton`, `BaseInput`, `ConfirmDialog`
9. `HomeView.vue` — hero + preview
10. Ajustes: loading states, responsividade, tratamento de erros
