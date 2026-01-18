/**
 * Plugin Configuration System
 *
 * Handles loading and validation of plugin configuration from various sources.
 */

import { z } from "zod";
import { readFile, access, constants } from "node:fs/promises";
import { join } from "node:path";
import { hooksConfigSchema } from "./hooks";

/**
 * Main configuration schema
 */
export const configSchema = z.object({
  /** Directory where worktrees will be created (relative to repo root) */
  worktreesDir: z.string().default("./worktrees"),
  /** Default prefix for branches if type cannot be determined */
  branchPrefix: z.string().default("feat"),
  /** Lifecycle hooks configuration */
  hooks: hooksConfigSchema.optional(),
  /** Preferred terminal adapter */
  terminal: z.enum(["wezterm"]).default("wezterm"),
});

/**
 * Configuration type
 */
export type Config = z.infer<typeof configSchema>;

/**
 * Default configuration
 */
export const DEFAULT_CONFIG: Config = {
  worktreesDir: "./worktrees",
  branchPrefix: "feat",
  terminal: "wezterm",
  hooks: {
    afterCreate: ["[ -f package.json ] && pnpm install || true"],
  },
};

/**
 * Load configuration from the repository
 *
 * Searches for configuration in:
 * 1. .opencode/transmute.config.json
 * 2. Defaults
 *
 * @param repoRoot - Repository root path
 * @returns Loaded and validated configuration
 */
export async function loadConfig(repoRoot: string): Promise<Config> {
  const configPath = join(repoRoot, ".opencode", "transmute.config.json");

  try {
    // Check if config file exists
    await access(configPath, constants.F_OK);

    // Read and parse config file
    const content = await readFile(configPath, "utf-8");
    const json = JSON.parse(content);

    // Validate and merge with defaults
    return configSchema.parse(json);
  } catch (error) {
    // If file doesn't exist or is invalid, return defaults
    // In a real implementation, we might want to log validation errors
    return DEFAULT_CONFIG;
  }
}
