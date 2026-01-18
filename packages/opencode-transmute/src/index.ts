/**
 * OpenCode Transmute Plugin
 *
 * A plugin for task-based development with git worktrees.
 * Creates isolated environments for each task with AI-generated branch names.
 *
 * For programmatic use of utility functions, import from 'opencode-transmute/utils'
 */

import type { Plugin, PluginInput } from "@opencode-ai/plugin";
import { tool } from "@opencode-ai/plugin";
import { type OpenCodeClient } from "./core/naming";
import { startTask } from "./tools/start-task";
import { createWezTermAdapter } from "./adapters/terminal/wezterm";
import { getGitRoot } from "./core/exec";
import { loadConfig } from "./core/config";

/**
 * Main Transmute Plugin
 *
 * Provides tools for:
 * - Creating isolated git worktrees for tasks
 * - AI-generated branch naming
 * - Session persistence across restarts
 * - Terminal integration (WezTerm)
 */
export const TransmutePlugin: Plugin = async (ctx: PluginInput) => {
  // Extract client for AI operations
  const client = ctx.client as unknown as OpenCodeClient;

  // Get repository root
  const basePath = await getGitRoot();

  // Load plugin configuration
  const config = await loadConfig(basePath);

  // Create terminal adapter
  const terminal = createWezTermAdapter();

  return {
    // Custom tools available to the LLM
    tool: {
      "start-task": tool({
        description:
          "Create an isolated git worktree for a task with AI-generated branch name. " +
          "Use this when starting work on a new task to ensure clean separation from other work. " +
          "If a session already exists for the task, it will resume the existing worktree.",
        args: {
          taskId: tool.schema
            .string()
            .describe("Unique task identifier (e.g., task-123)"),
          title: tool.schema
            .string()
            .describe("Task title for branch name generation"),
          description: tool.schema
            .string()
            .optional()
            .describe("Task description for better branch name inference"),
          priority: tool.schema
            .string()
            .optional()
            .describe("Task priority (low, medium, high, critical)"),
          type: tool.schema
            .string()
            .optional()
            .describe(
              "Branch type hint: feat, fix, refactor, docs, chore, test",
            ),
          baseBranch: tool.schema
            .string()
            .optional()
            .describe("Base branch to create worktree from (default: main)"),
        },
        async execute(args, context) {
          try {
            // Execute the full start-task flow
            const result = await startTask(
              {
                taskId: args.taskId,
                title: args.title,
                description: args.description,
                priority: args.priority,
                type: args.type,
                baseBranch: args.baseBranch,
              },
              basePath,
              {
                client,
                opencodeSessionId: context.sessionID,
                terminal,
                config,
                openTerminal: true,
                runHooks: true,
              },
            );

            let message = result.message;
            if (!message) {
              if (result.status === "created") {
                message = `Created new worktree for task: ${result.taskId}`;
              } else if (result.status === "existing") {
                message = `Resumed existing worktree for task: ${result.taskId}`;
              } else {
                message = `Failed to start task: ${result.taskId}`;
              }
            }

            return JSON.stringify({
              status: result.status,
              message,
              taskId: result.taskId,
              taskName: result.taskName,
              branch: result.branch,
              worktreePath: result.worktreePath,
              opencodeSessionId: result.opencodeSessionId,
            });
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            
            // Log to console for immediate visibility
            console.error(`[opencode-transmute] Critical error in start-task:`, error);

            // Log the critical failure
            if (client?.app?.log) {
              await client.app.log({
                body: {
                  service: "opencode-transmute",
                  level: "error",
                  message: `Critical error in start-task tool: ${errorMessage}`,
                  extra: {
                    stack: error instanceof Error ? error.stack : undefined,
                    args,
                  },
                },
              });
            }

            // Return a safe JSON error response
            return JSON.stringify({
              status: "failed",
              message: `Tool execution failed: ${errorMessage}`,
              taskId: args.taskId,
            });
          }
        },
      }),
    },

    // Event hooks (to be implemented in future tasks)
    // event: async ({ event }) => {
    //   // Handle session events, file changes, etc.
    // },
  };
};

// Default export for OpenCode plugin loading
export default TransmutePlugin;
