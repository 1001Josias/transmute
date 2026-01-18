/**
 * Utility exports for programmatic use of opencode-transmute
 *
 * This file exports all utility functions for users who want to use
 * the library programmatically (not as an OpenCode plugin).
 *
 * Import from 'opencode-transmute/utils' instead of 'opencode-transmute'
 */

// Types
export type {
  TaskContext,
  BranchNameResult,
  OpenCodeClient,
} from "./core/naming";
export type { Worktree, CreateWorktreeOptions } from "./core/worktree";
export type { Session, State } from "./core/session";
export type {
  HooksConfig,
  HookResult,
  ExecuteHooksOptions,
} from "./core/hooks";
export type { WorktreeError, TerminalError } from "./core/errors";
export type {
  TerminalAdapter,
  OpenSessionOptions,
} from "./adapters/terminal/types";
export type {
  StartTaskInput,
  StartTaskOutput,
  StartTaskOptions,
} from "./tools/start-task";

// Core functions - naming
export {
  generateBranchName,
  generateBranchNameWithAI,
  generateFallbackBranchName,
  sanitizeBranchName,
} from "./core/naming";

// Core functions - worktree
export {
  listWorktrees,
  createWorktree,
  removeWorktree,
  worktreeExists,
  getWorktreeByBranch,
  getWorktreesDir,
  getWorktreePath,
  pruneWorktrees,
} from "./core/worktree";

// Core functions - session
export {
  loadState,
  saveState,
  addSession,
  removeSession,
  findSessionByTask,
  createEmptyState,
  getStateFilePath,
  getStateDir,
} from "./core/session";

// Core functions - hooks
export {
  executeHooks,
  executeAfterCreateHooks,
  executeBeforeDestroyHooks,
} from "./core/hooks";

// Core functions - exec
export {
  exec,
  gitExec,
  getGitRoot,
  isGitRepository,
  branchExists,
  remoteBranchExists,
} from "./core/exec";

// Error factories
export {
  createBranchAlreadyExistsError,
  createDirectoryAlreadyExistsError,
  createGitNotInitializedError,
  createBaseBranchNotFoundError,
  createWorktreeNotFoundError,
  createExecError,
  createTerminalNotAvailableError,
  createTerminalSpawnError,
  createInvalidPathError,
  isWorktreeError,
} from "./core/errors";

// Terminal
export {
  checkTerminalAvailability,
  getFirstAvailableTerminal,
} from "./adapters/terminal/types";
export { createWezTermAdapter } from "./adapters/terminal/wezterm";

// Tools
export { startTask, resumeTask } from "./tools/start-task";
