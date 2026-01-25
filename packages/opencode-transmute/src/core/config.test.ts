
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import path from "path";
import fs from "fs/promises";
import {
  loadConfig,
  resolveWorktreesDir,
  defaultConfig,
  transmuteConfigSchema,
  loadConfigFromFile,
  findConfigFile
} from "./config";
import * as exec from "./exec";

// Mock dependencies
vi.mock("fs/promises");
vi.mock("./exec");

describe("Configuration System", () => {
    const mockRepoRoot = "/abs/path/to/repo";

    beforeEach(() => {
        vi.resetAllMocks();
        vi.mocked(exec.getGitRoot).mockResolvedValue(mockRepoRoot);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("Schema Validation", () => {
        it("should validate default config", () => {
            const result = transmuteConfigSchema.safeParse({});
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.worktreesDir).toBe("./worktrees");
                expect(result.data.terminal).toBe("wezterm");
            }
        });

        it("should accept valid overrides", () => {
             const result = transmuteConfigSchema.safeParse({
                 worktreesDir: "./custom-worktrees",
                 terminal: "tmix", // Invalid
                 autoOpenTerminal: false
             });
             
             // Zod safeParse returns valid data for valid fields? No, it fails whole object strict validation
             // or returns error for specific fields.
             expect(result.success).toBe(false);
             
             const validResult = transmuteConfigSchema.safeParse({
                 worktreesDir: "./custom-worktrees",
                 terminal: "tmux",
                 autoOpenTerminal: false
             });
             expect(validResult.success).toBe(true);
             if (validResult.success) {
                 expect(validResult.data.worktreesDir).toBe("./custom-worktrees");
                 expect(validResult.data.terminal).toBe("tmux");
                 expect(validResult.data.autoOpenTerminal).toBe(false);
                 // Defaults should be preserved for missing fields if we were merging, 
                 // but schema parse of partial object applies defaults.
                 expect(validResult.data.useAiBranchNaming).toBe(true);
             }
        });
    });

    describe("resolveWorktreesDir", () => {
        it("should resolve relative path", () => {
             const config = { ...defaultConfig, worktreesDir: "./foo" };
             const result = resolveWorktreesDir(mockRepoRoot, config);
             expect(result).toBe(path.join(mockRepoRoot, "foo"));
        });

        it("should return absolute path as is", () => {
             const absPath = "/tmp/worktrees";
             const config = { ...defaultConfig, worktreesDir: absPath };
             const result = resolveWorktreesDir(mockRepoRoot, config);
             expect(result).toBe(absPath);
        });
    });

    describe("findConfigFile", () => {
        it("should find .opencode/transmute.config.json first", async () => {
             vi.mocked(fs.access).mockImplementation(async (p) => {
                 if (p.toString().endsWith(".opencode/transmute.config.json")) return;
                 throw new Error("ENOENT");
             });

             const result = await findConfigFile(mockRepoRoot);
             expect(result).toBe(path.join(mockRepoRoot, ".opencode", "transmute.config.json"));
        });

        it("should find transmute.config.json second", async () => {
             vi.mocked(fs.access).mockImplementation(async (p) => {
                 if (p.toString().endsWith(".opencode/transmute.config.json")) throw new Error("ENOENT");
                 if (p.toString().endsWith("/transmute.config.json")) return;
                 throw new Error("ENOENT");
             });

             const result = await findConfigFile(mockRepoRoot);
             expect(result).toBe(path.join(mockRepoRoot, "transmute.config.json"));
        });

        it("should return null if no config found", async () => {
             vi.mocked(fs.access).mockRejectedValue(new Error("ENOENT"));
             const result = await findConfigFile(mockRepoRoot);
             expect(result).toBeNull();
        });
    });

    describe("loadConfig", () => {
        it("should return defaults if no config file found", async () => {
             vi.mocked(fs.access).mockRejectedValue(new Error("ENOENT"));
             const config = await loadConfig(mockRepoRoot);
             expect(config).toEqual(defaultConfig);
        });

        it("should merge file config with defaults", async () => {
             const partialConfig = {
                 worktreesDir: "custom",
                 autoRunHooks: false
             };
             
             // Mock finding file
             vi.mocked(fs.access).mockImplementation(async (p) => {
                  if (p.toString().endsWith("transmute.config.json")) return;
                  throw new Error("ENOENT");
             });
             
             // Mock reading file
             vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(partialConfig));

             const config = await loadConfig(mockRepoRoot);
             expect(config.worktreesDir).toBe("custom");
             expect(config.autoRunHooks).toBe(false);
             expect(config.terminal).toBe(defaultConfig.terminal); // Preservation of defaults
        });

        it("should handle invalid json gracefully", async () => {
             vi.mocked(fs.access).mockResolvedValue(undefined);
             vi.mocked(fs.readFile).mockResolvedValue("{ invalid json");

             const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
             
             const config = await loadConfig(mockRepoRoot);
             expect(config).toEqual(defaultConfig);
             expect(consoleSpy).toHaveBeenCalled();
        });
    });
});
