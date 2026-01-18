/**
 * Custom Errors for Git Worktree Operations
 *
 * Provides factory functions for errors in worktree operations.
 * Using factory functions instead of classes to avoid build issues with "constructor without new".
 */

/**
 * Error codes for worktree operations
 */
export const WorktreeErrorCode = {
  BRANCH_EXISTS: "BRANCH_EXISTS",
  DIR_EXISTS: "DIR_EXISTS",
  NO_GIT_REPO: "NO_GIT_REPO",
  BASE_NOT_FOUND: "BASE_NOT_FOUND",
  WORKTREE_NOT_FOUND: "WORKTREE_NOT_FOUND",
  EXEC_FAILED: "EXEC_FAILED",
} as const;

export type WorktreeErrorCodeType =
  (typeof WorktreeErrorCode)[keyof typeof WorktreeErrorCode];

export interface WorktreeError extends Error {
  code: WorktreeErrorCodeType;
  // Specific properties for different error types
  branch?: string;
  path?: string;
  command?: string;
  stderr?: string;
  exitCode?: number;
}

export function isWorktreeError(error: unknown): error is WorktreeError {
  return error instanceof Error && "code" in error;
}

export function createBranchAlreadyExistsError(branch: string): WorktreeError {
  const message = `Branch '${branch}' already exists. Use a different branch name or checkout the existing branch.`;
  const error = new Error(message) as WorktreeError;
  error.name = "BranchAlreadyExistsError";
  error.code = WorktreeErrorCode.BRANCH_EXISTS;
  error.branch = branch;
  return error;
}

export function createDirectoryAlreadyExistsError(path: string): WorktreeError {
  const message = `Directory '${path}' already exists. Choose a different path or remove the existing directory.`;
  const error = new Error(message) as WorktreeError;
  error.name = "DirectoryAlreadyExistsError";
  error.code = WorktreeErrorCode.DIR_EXISTS;
  error.path = path;
  return error;
}

export function createGitNotInitializedError(path: string): WorktreeError {
  const message = `Not a git repository: '${path}'. Initialize git or navigate to a git repository.`;
  const error = new Error(message) as WorktreeError;
  error.name = "GitNotInitializedError";
  error.code = WorktreeErrorCode.NO_GIT_REPO;
  error.path = path;
  return error;
}

export function createBaseBranchNotFoundError(branch: string): WorktreeError {
  const message = `Base branch '${branch}' not found. Verify the branch name or fetch from remote.`;
  const error = new Error(message) as WorktreeError;
  error.name = "BaseBranchNotFoundError";
  error.code = WorktreeErrorCode.BASE_NOT_FOUND;
  error.branch = branch;
  return error;
}

export function createWorktreeNotFoundError(branch: string): WorktreeError {
  const message = `Worktree for branch '${branch}' not found.`;
  const error = new Error(message) as WorktreeError;
  error.name = "WorktreeNotFoundError";
  error.code = WorktreeErrorCode.WORKTREE_NOT_FOUND;
  error.branch = branch;
  return error;
}

export function createExecError(command: string, stderr: string, exitCode: number): WorktreeError {
  const message = `Command failed: ${command}\nExit code: ${exitCode}\n${stderr}`;
  const error = new Error(message) as WorktreeError;
  error.name = "ExecError";
  error.code = WorktreeErrorCode.EXEC_FAILED;
  error.command = command;
  error.stderr = stderr;
  error.exitCode = exitCode;
  return error;
}

/**
 * Terminal Errors
 */
export const TerminalErrorCode = {
  NOT_AVAILABLE: "NOT_AVAILABLE",
  SPAWN_FAILED: "SPAWN_FAILED",
  INVALID_PATH: "INVALID_PATH",
} as const;

export type TerminalErrorCodeType =
  (typeof TerminalErrorCode)[keyof typeof TerminalErrorCode];

export interface TerminalError extends Error {
  code: TerminalErrorCodeType;
  terminal?: string;
  reason?: string;
  path?: string;
}

export function createTerminalNotAvailableError(terminal: string): TerminalError {
  const message = `Terminal '${terminal}' is not available. Please install it or check your PATH.`;
  const error = new Error(message) as TerminalError;
  error.name = "TerminalNotAvailableError";
  error.code = TerminalErrorCode.NOT_AVAILABLE;
  error.terminal = terminal;
  return error;
}

export function createTerminalSpawnError(terminal: string, reason: string): TerminalError {
  const message = `Failed to spawn terminal session in '${terminal}': ${reason}`;
  const error = new Error(message) as TerminalError;
  error.name = "TerminalSpawnError";
  error.code = TerminalErrorCode.SPAWN_FAILED;
  error.terminal = terminal;
  error.reason = reason;
  return error;
}

export function createInvalidPathError(path: string): TerminalError {
  const message = `Invalid path: '${path}'. The directory does not exist or is not accessible.`;
  const error = new Error(message) as TerminalError;
  error.name = "InvalidPathError";
  error.code = TerminalErrorCode.INVALID_PATH;
  error.path = path;
  return error;
}
