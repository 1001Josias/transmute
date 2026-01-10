# State Management Improvements - Tasks

## Task 1: Implement nuqs for URL Query Params
- [ ] Install `nuqs` package
- [ ] Create query param hooks for common patterns:
  - [ ] `useTaskIdParam()` - selected task ID
  - [ ] `useFilterParam()` - task list filter
  - [ ] `useTabParam()` - active tab selection
- [ ] Refactor `TaskList` to use nuqs instead of `window.history`
- [ ] Refactor `TaskDetailModal` to read task ID from nuqs
- [ ] Test URL sharing and bookmarking

## Task 2: Implement Zustand for Global State
- [ ] Install `zustand` package
- [ ] Create stores:
  - [ ] `useTaskStore` - task cache and optimistic updates
  - [ ] `useUIStore` - sidebar state, modal states
- [ ] Migrate optimistic update logic from components to store
- [ ] Remove prop drilling for shared state
- [ ] Add devtools middleware for debugging

## Task 3: Combine nuqs + Zustand
- [ ] Define clear boundaries:
  - URL state (nuqs): filters, selected items, pagination
  - Memory state (Zustand): cache, loading states, UI state
- [ ] Create integration patterns/hooks
- [ ] Document state management conventions in AGENTS.md
