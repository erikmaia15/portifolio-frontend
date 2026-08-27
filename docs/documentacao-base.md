# Plano de Portfólio Dinâmico — NestJS + PostgreSQL + Vue 3 + Tailwind

Sistema com site público (mostra os projetos) + painel admin (CRUD de projetos).

---

## 1. VISÃO GERAL DA ARQUITETURA

```
[Frontend - Vue 3 + TS + Tailwind]  <--- API REST/JSON --->  [Backend - NestJS]
                                                                     |
                                                              [PostgreSQL]
```

- **Frontend público**: home, projetos, contato
- **Frontend admin**: login + CRUD de projetos
- **Backend**: NestJS organizado por módulos (padrão da própria arquitetura do Nest)
- **Banco**: PostgreSQL, com `TypeORM` ou `Prisma` (vou seguir com **TypeORM**, que é o mais usado com Nest, mas cito a alternativa)

---

## 2. BACKEND (NestJS)

### 2.1 Stack

- **NestJS** (Express por baixo, padrão)
- **PostgreSQL**
- **TypeORM** (integração nativa via `@nestjs/typeorm`) — alternativa: Prisma com `nestjs-prisma`
- **Auth**: JWT via `@nestjs/jwt` + `@nestjs/passport` + `passport-jwt`
- **Validação**: `class-validator` + `class-transformer` (padrão Nest via DTOs)
- **Hash de senha**: `bcrypt`

### 2.2 Arquitetura por módulos

Estrutura típica do Nest: cada domínio é um módulo isolado (`Module`, `Controller`, `Service`, `Entity`, `DTOs`).

```
backend/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   │
│   ├── config/
│   │   └── typeorm.config.ts          → configuração de conexão com Postgres
│   │
│   ├── common/
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts       → protege rotas admin
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   └── filters/
│   │       └── http-exception.filter.ts
│   │
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   └── dto/
│   │       └── login.dto.ts
│   │
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── users.entity.ts
│   │   └── dto/
│   │       └── create-user.dto.ts
│   │
│   └── projects/
│       ├── projects.module.ts
│       ├── projects.controller.ts
│       ├── projects.service.ts
│       ├── projects.entity.ts
│       └── dto/
│           ├── create-project.dto.ts
│           └── update-project.dto.ts
│
├── .env
├── package.json
└── tsconfig.json
```

Cada módulo (`AuthModule`, `UsersModule`, `ProjectsModule`) é importado no `AppModule`. Isso mantém o código desacoplado e fácil de escalar (ex: no futuro adicionar `CategoriesModule`, `ContactModule` etc.).

### 2.3 Modelagem do banco

**Entity `User`** (`users/users.entity.ts`)

```ts
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

**Entity `Project`** (`projects/projects.entity.ts`)

```ts
@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column("text")
  description: string;

  @Column()
  imageUrl: string;

  @Column()
  projectUrl: string;

  @Column({ default: 0 })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 2.4 DTOs (validação automática via `class-validator`)

**`create-project.dto.ts`**

```ts
export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  imageUrl: string;

  @IsUrl()
  projectUrl: string;
}
```

**`update-project.dto.ts`**

```ts
export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
```

**`login.dto.ts`**

```ts
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

### 2.5 Endpoints da API

**AuthController** (`/api/auth`)

```
POST /api/auth/login    → { email, password } → { access_token }
GET  /api/auth/me       → retorna dados do admin logado (rota protegida por JwtAuthGuard)
```

**ProjectsController** (`/api/projects`)

```
GET    /api/projects            → público, lista todos os projetos
GET    /api/projects/:id        → público, detalhe de um projeto

POST   /api/projects            → protegido (JwtAuthGuard), cria projeto
PATCH  /api/projects/:id        → protegido, edita projeto
DELETE /api/projects/:id        → protegido, remove projeto
```

Uso do `@UseGuards(JwtAuthGuard)` nos métodos de escrita (POST/PATCH/DELETE) e deixando GET público, tudo dentro do mesmo controller — é o padrão mais comum no Nest para esse caso.

### 2.6 Autenticação (fluxo)

1. `AuthService.validateUser()` busca o usuário pelo email, compara senha com `bcrypt.compare`
2. Se válido, `AuthService.login()` gera JWT com `JwtService.sign({ sub: user.id, email })`
3. `JwtStrategy` (via Passport) valida o token em cada request nas rotas protegidas
4. `JwtAuthGuard` aplicado nos controllers/rotas que precisam de autenticação

### 2.7 Segurança

- Senha com `bcrypt` (hash + salt), nunca texto puro
- `JWT_SECRET` e `DATABASE_URL` em `.env`, carregados via `@nestjs/config`
- `ValidationPipe` global no `main.ts` (`whitelist: true`, `forbidNonWhitelisted: true`) para bloquear campos não esperados no payload
- Rate limiting no login com `@nestjs/throttler`
- CORS configurado (`app.enableCors({ origin: 'https://seu-dominio.com' })`)

### 2.8 `main.ts` (resumo)

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({ origin: process.env.FRONTEND_URL });
  await app.listen(3000);
}
```

### 2.9 Deploy

- Backend: Railway, Render ou Fly.io (todos suportam Nest sem configuração extra)
- Banco: Neon, Supabase ou Railway Postgres (free tier funciona bem pra começar)
- Migrations: usar `typeorm migration:generate` / `migration:run` (evitar `synchronize: true` em produção)

---

## 3. FRONTEND (Vue 3 + TypeScript + Tailwind)

### 3.1 Stack

- **Vue 3** com `<script setup lang="ts">`
- **Vite** como bundler
- **Vue Router** para navegação
- **Pinia** para estado global (auth, lista de projetos)
- **TailwindCSS** para estilo
- **Axios** para chamadas HTTP (com instância configurada + interceptor de token)

### 3.2 Estrutura de pastas

```
frontend/
├── src/
│   ├── main.ts
│   ├── App.vue
│   │
│   ├── router/
│   │   └── index.ts               → rotas públicas + admin (com meta.requiresAuth)
│   │
│   ├── stores/
│   │   ├── auth.store.ts          → Pinia: token, user, login/logout
│   │   └── projects.store.ts      → Pinia: lista de projetos, CRUD actions
│   │
│   ├── services/
│   │   └── api.ts                 → instância do axios (baseURL + interceptor JWT)
│   │
│   ├── types/
│   │   └── project.ts             → interface Project { id, name, description, imageUrl, projectUrl }
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.vue
│   │   │   └── AdminSidebar.vue
│   │   ├── project/
│   │   │   ├── ProjectCard.vue     → card público (clicável, abre projectUrl)
│   │   │   ├── ProjectGrid.vue     → grid de cards
│   │   │   └── ProjectForm.vue     → form reaproveitado em criar/editar
│   │   └── ui/
│   │       ├── BaseButton.vue
│   │       ├── BaseInput.vue
│   │       └── ConfirmDialog.vue
│   │
│   └── views/
│       ├── public/
│       │   ├── HomeView.vue        → hero + sobre + destaque de projetos
│       │   └── ProjectsView.vue    → grid completo de projetos
│       │
│       └── admin/
│           ├── LoginView.vue
│           ├── DashboardView.vue   → lista de projetos com ações editar/excluir
│           ├── ProjectCreateView.vue
│           └── ProjectEditView.vue
│
├── tailwind.config.ts
├── .env
└── package.json
```

### 3.3 Organização das telas (site público)

**HomeView.vue**

- Hero: nome, título, frase de posicionamento, CTAs ("ver projetos", "contato")
- Seção "sobre" (pode ser só uma seção, não precisa de rota separada)
- Preview dos projetos em destaque (ex: 3 mais recentes, usando `ProjectGrid` com `limit`)

**ProjectsView.vue**

- Busca todos os projetos via `projects.store.ts` → `GET /api/projects`
- Renderiza `ProjectGrid` → várias `ProjectCard`
- Estados: loading (skeleton), vazio ("nenhum projeto ainda"), erro

**ProjectCard.vue** (o clique leva ao projeto)

```vue
<template>
  <a
    :href="project.projectUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="block rounded-xl overflow-hidden shadow hover:shadow-lg transition"
  >
    <img
      :src="project.imageUrl"
      :alt="project.name"
      class="w-full h-48 object-cover"
    />
    <div class="p-4">
      <h3 class="font-semibold text-lg">{{ project.name }}</h3>
      <p class="text-sm text-gray-600 line-clamp-2">
        {{ project.description }}
      </p>
    </div>
  </a>
</template>
```

### 3.4 Painel Admin

**LoginView.vue** (`/admin/login`)

- Form: email, senha
- Submit → `authStore.login()` → chama `POST /api/auth/login` → salva token (Pinia + `localStorage`, ou cookie httpOnly se o back setar)
- Erro de credenciais exibido no form
- Sucesso → redireciona para `/admin/dashboard`

**DashboardView.vue** (`/admin/dashboard`)

- Tabela/lista de projetos com: thumbnail, nome, ações (editar/excluir)
- Botão "Novo projeto" → `/admin/projects/novo`
- Excluir → `ConfirmDialog` antes de chamar `DELETE /api/projects/:id`

**ProjectCreateView.vue / ProjectEditView.vue**

- Usa `ProjectForm.vue` (componente compartilhado, recebe `project` opcional via prop para modo edição)
- Campos: nome, descrição (textarea), URL da imagem, URL do projeto
- **Preview ao vivo da imagem** enquanto o admin digita a URL (bind `imageUrl` num `<img>` com fallback se der erro de carregamento)
- Validação no client (campos obrigatórios + formato de URL) antes de enviar
- Submit → cria (`POST`) ou edita (`PATCH`) → redireciona pro dashboard com toast de sucesso

**ProjectForm.vue** (esqueleto)

```vue
<script setup lang="ts">
import { ref, watch } from "vue";
import type { Project } from "@/types/project";

const props = defineProps<{ initial?: Partial<Project> }>();
const emit = defineEmits<{ submit: [data: Partial<Project>] }>();

const form = ref({
  name: props.initial?.name ?? "",
  description: props.initial?.description ?? "",
  imageUrl: props.initial?.imageUrl ?? "",
  projectUrl: props.initial?.projectUrl ?? "",
});
</script>

<template>
  <form @submit.prevent="emit('submit', form)" class="space-y-4">
    <BaseInput v-model="form.name" label="Nome do projeto" required />
    <textarea
      v-model="form.description"
      class="w-full border rounded p-2"
      required
    />
    <BaseInput
      v-model="form.imageUrl"
      label="URL da imagem"
      required
      type="url"
    />
    <img
      v-if="form.imageUrl"
      :src="form.imageUrl"
      class="w-32 h-32 object-cover rounded"
    />
    <BaseInput
      v-model="form.projectUrl"
      label="URL do projeto"
      required
      type="url"
    />
    <BaseButton type="submit">Salvar</BaseButton>
  </form>
</template>
```

### 3.5 Rotas (Vue Router) com proteção de admin

```ts
const routes = [
  { path: "/", component: HomeView },
  { path: "/projetos", component: ProjectsView },

  { path: "/admin/login", component: LoginView },
  {
    path: "/admin/dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/projects/novo",
    component: ProjectCreateView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/projects/:id/editar",
    component: ProjectEditView,
    meta: { requiresAuth: true },
  },
];

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return "/admin/login";
  }
});
```

### 3.6 Pinia — `auth.store.ts` (resumo)

```ts
export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token"));

  async function login(email: string, password: string) {
    const { data } = await api.post("/auth/login", { email, password });
    token.value = data.access_token;
    localStorage.setItem("token", data.access_token);
  }

  function logout() {
    token.value = null;
    localStorage.removeItem("token");
  }

  const isAuthenticated = computed(() => !!token.value);

  return { token, login, logout, isAuthenticated };
});
```

### 3.7 Axios com interceptor de token (`services/api.ts`)

```ts
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

## 4. ORDEM DE IMPLEMENTAÇÃO SUGERIDA

1. Backend: setup do NestJS + conexão Postgres + módulo `Projects` (entity, DTO, CRUD sem auth) → testar via Insomnia/Postman
2. Backend: módulo `Auth` (JWT, guard, strategy) + módulo `Users`
3. Frontend: setup Vite + Vue 3 + Tailwind + estrutura de pastas
4. Frontend: `ProjectsView` pública consumindo `GET /api/projects`
5. Frontend: `LoginView` + `auth.store.ts`
6. Frontend: `DashboardView` (listar/excluir projetos)
7. Frontend: `ProjectForm` compartilhado (criar/editar)
8. Ajustes finais: loading states, responsividade, deploy

---

## 5. EXTRAS (evolução futura)

- Upload real de imagem (Cloudinary/S3) em vez de só URL
- Categorias/tags nos projetos
- Reordenar projetos por drag-and-drop (`order` já está no schema)
- Dark mode com Tailwind
- Testes: Jest no backend (Nest já vem configurado), Vitest no frontend
