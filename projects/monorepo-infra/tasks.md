---
project_id: monorepo-infra
prd_version: '1.0'
created_at: '2026-01-05'
updated_at: '2026-01-05'
---

# Tasks: Infraestrutura de Monorepo

## Task 1: Setup do Workspace
- **id:** task-201
- **status:** todo
- **priority:** critical
- **description:** Inicializar e configurar a raiz do monorepo.

### Subtasks

#### [ ] Configurar pnpm workspaces
Criar `pnpm-workspace.yaml` definindo `apps/*` e `packages/*`.

#### [ ] Inicializar Turborepo
Criar `turbo.json` com pipelines de `build`, `dev`, `lint`.

#### [ ] Ajustar package.json raiz
Definir scripts globais e remover dependências que serão movidas para os apps.

---

## Task 2: Extração de Configurações
- **id:** task-202
- **status:** todo
- **priority:** high
- **description:** Criar pacotes de configuração compartilhada.

### Subtasks

#### [ ] Criar packages/tsconfig
Pacote com `tsconfig.base.json` e `tsconfig.next.json`.

#### [ ] Criar packages/eslint-config
Pacote com configuração base do ESLint/Prettier.

#### [ ] Criar packages/tailwind-config
Pacote com preset do Tailwind (cores, fontes do BlueprintAI).

---

## Task 3: Migração do Web App
- **id:** task-203
- **status:** todo
- **priority:** critical
- **description:** Mover o código do app atual para `apps/web`.

### Subtasks

#### [ ] Mover arquivos
Mover `src/`, `public/` e arquivos de config para `apps/web`.

#### [ ] Ajustar imports internos
Corrigir caminhos relativos e aliases (`@/*`).

#### [ ] Validar execução isolada
Garantir que o app roda corretamente dentro do novo local.

---

## Task 4: Extração de Código Compartilhado
- **id:** task-204
- **status:** todo
- **priority:** medium
- **description:** Extrair lógica business-agnostic para packages.

### Subtasks

#### [ ] Extrair packages/schemas
Mover definições Zod para pacote compartilhado.

#### [ ] Extrair packages/utils
Mover helpers genéricos.

#### [ ] Refatorar Web App para usar packages
Substituir imports locais por imports de `@blueprint/schemas` e `@blueprint/utils`.
