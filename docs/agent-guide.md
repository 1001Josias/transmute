# BlueprintAI - Agent Guide

This document provides instructions for AI agents to generate PRDs and tasks for BlueprintAI.

## Directory Structure

Create files in `content/projects/<project-slug>/`:

```
content/projects/
└── my-project/
    ├── prd.md      # Product Requirements Document
    └── tasks.md    # Tasks derived from the PRD
```

## PRD Schema (`prd.md`)

```markdown
---
id: "project-slug"
title: "Project Title"
status: "draft"              # draft | in_review | approved | rejected
version: "1.0"
created_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
author: "ai-agent"
---

# Project Title

## Objetivo
Clear description of what this project aims to achieve.

## Contexto
Background information and motivation for the project.

## Requisitos Funcionais
1. Requirement 1
2. Requirement 2
3. Requirement 3

## Requisitos Não-Funcionais
- Performance requirements
- Security requirements
- Compatibility requirements

## Fora do Escopo
- What will NOT be included

## Métricas de Sucesso
- How success will be measured
```

### PRD Status Values

| Status | Description |
|--------|-------------|
| `draft` | Initial state, being written |
| `in_review` | Awaiting user approval |
| `approved` | Ready for implementation |
| `rejected` | Needs revision |

---

## Tasks Schema (`tasks.md`)

```markdown
---
project_id: "project-slug"
prd_version: "1.0"
created_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
---

# Tasks: Project Title

## Task 1: Task Title
- **id:** task-001
- **status:** todo
- **priority:** high
- **description:** Clear description of what needs to be done.

### Subtasks

#### [ ] Subtask Title
Description of the subtask with enough detail to understand the work.

#### [x] Completed Subtask
This subtask is marked as done.

---

## Task 2: Another Task
- **id:** task-002
- **status:** in_progress
- **priority:** medium
- **description:** Another task description.

### Subtasks

#### [ ] First Subtask
Subtask description here.
```

### Task Status Values

| Status | Description |
|--------|-------------|
| `todo` | Not started |
| `in_progress` | Currently being worked on |
| `done` | Completed |
| `blocked` | Cannot proceed |

### Priority Values

| Priority | Description |
|----------|-------------|
| `low` | Nice to have |
| `medium` | Normal priority |
| `high` | Important |
| `critical` | Must be done ASAP |

---

## Workflow

1. **Create PRD**: Generate `prd.md` with status `draft`
2. **User Review**: Change status to `in_review`
3. **Approval**: User changes status to `approved` or provides feedback
4. **Generate Tasks**: Create `tasks.md` based on approved PRD
5. **Update**: Keep `updated_at` current when making changes

---

## Best Practices

1. **Use kebab-case** for project slugs (e.g., `auth-refactor`)
2. **Keep IDs unique** within the project (e.g., `task-001`, `task-002`)
3. **Be descriptive** in task and subtask descriptions
4. **Update dates** when modifying files
5. **Version PRDs** when making significant changes
