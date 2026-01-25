/**
 * Configuration System
 *
 * Manages configuration for the Transmute plugin.
 * Loads settings from various sources with precedence.
 */

import { z } from "zod";
import path from "path";
import fs from "fs/promises";
import { branchTypeSchema } from "./naming";
import { hooksConfigSchema, defaultHooks } from "./hooks";
import { getGitRoot } from "./exec";

/**
 * Terminal type schema
 */
export const terminalTypeSchema = z.enum(["wezterm", "tmux", "kitty", "none"]);
export type TerminalType = z.infer<typeof terminalTypeSchema>;

/**
 * Transmute Configuration Schema
 */
export const transmuteConfigSchema = z.object({
  /** Directory where worktrees are stored (relative to git root) */
  worktreesDir: z.string().default("./worktrees"),
  
  /** Default type for new branches */
  defaultBranchType: branchTypeSchema.default("feat"),
  
  /** Maximum length for the slug part of the branch name */
  maxBranchSlugLength: z.number().int().positive().default(40),
  
  /** Hooks configuration */
  hooks: hooksConfigSchema.default(defaultHooks),
  
  /** Terminal emulator to use */
  terminal: terminalTypeSchema.default("wezterm"),
  
  /** Whether to automatically open terminal after creating worktree */
  autoOpenTerminal: z.boolean().default(true),
  
  /** Whether to automatically run hooks */
  autoRunHooks: z.boolean().default(true),
  
  /** Default base branch to checkout from */
  defaultBaseBranch: z.string().default("main"),
  
  /** Whether to use AI for branch naming */
  useAiBranchNaming: z.boolean().default(true),
});

export type TransmuteConfig = z.infer<typeof transmuteConfigSchema>;

/**
 * Partial configuration for loading
 */
const partialConfigSchema = transmuteConfigSchema.partial();
type PartialTransmuteConfig = z.infer<typeof partialConfigSchema>;

/**
 * Defaults definition
 */
export const defaultConfig: TransmuteConfig = transmuteConfigSchema.parse({});

/**
 * Resolve the absolute path for worktrees directory
 */
export function resolveWorktreesDir(repoRoot: string, config: TransmuteConfig): string {
  if (path.isAbsolute(config.worktreesDir)) {
    return config.worktreesDir;
  }
  return path.resolve(repoRoot, config.worktreesDir);
}

/**
 * Find configuration file in the repository
 */
export async function findConfigFile(repoRoot: string): Promise<string | null> {
  const candidates = [
    // Precedence 1: .opencode/transmute.config.json
    path.join(repoRoot, ".opencode", "transmute.config.json"),
    // Precedence 2: transmute.config.json
    path.join(repoRoot, "transmute.config.json"),
  ];

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Continue to next candidate
    }
  }

  return null;
}

/**
 * Load configuration from a JSON file
 */
export async function loadConfigFromFile(filePath: string): Promise<PartialTransmuteConfig> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(content);
    return partialConfigSchema.parse(json);
  } catch (error) {
    console.warn(`[transmute] Failed to load config from ${filePath}:`, error);
    return {};
  }
}

/**
 * Load configuration with precedence logic
 */
export async function loadConfig(repoRoot?: string): Promise<TransmuteConfig> {
  const root = repoRoot || (await getGitRoot());
  
  // 1. Try to find config file
  const configFile = await findConfigFile(root);
  
  let fileConfig: PartialTransmuteConfig = {};
  
  if (configFile) {
    fileConfig = await loadConfigFromFile(configFile);
  }

  // 2. Merge with defaults
  // Note: we can interpret 'undefined' values in fileConfig as "use default"
  // But spread operator overwrites with undefined if key exists.
  // Zod's parse with defaults usually handles this if we pass strict undefined, 
  // but JSON.parse might result in nulls or missing keys.
  
  // We use Zod to merge and validate against defaults
  const result = transmuteConfigSchema.safeParse({
     ...defaultConfig, // start with defaults
     ...fileConfig,    // overwrite with file config
     // Deep merge for hooks if necessary? 
     // For now shallow merge of 'hooks' object is acceptable as it replaces the whole config
     // If we want partial hook updates, we'd need deep merge.
     // Let's assume user provides full hooks config key if they want to override it,
     // or we can implement specific logic for hooks.
     hooks: {
         ...defaultConfig.hooks,
         ...(fileConfig.hooks || {})
     }
  });

  if (result.success) {
    return result.data;
  } else {
    console.warn("[transmute] Invalid configuration found, using defaults:", result.error);
    return defaultConfig;
  }
}
