import { describe, it, expect, vi, beforeEach } from "vitest";
import { loadConfig, DEFAULT_CONFIG } from "./config";
import * as fs from "node:fs/promises";

// Mock fs/promises
vi.mock("node:fs/promises", () => ({
  readFile: vi.fn(),
  access: vi.fn(),
  constants: { F_OK: 0 },
}));

describe("loadConfig", () => {
  const repoRoot = "/test/repo";

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns default config when file does not exist", async () => {
    vi.mocked(fs.access).mockRejectedValue(new Error("File not found"));

    const config = await loadConfig(repoRoot);

    expect(config).toEqual(DEFAULT_CONFIG);
  });

  it("loads and validates config from JSON file", async () => {
    const customConfig = {
      worktreesDir: "./custom-worktrees",
      branchPrefix: "task",
      terminal: "wezterm",
      hooks: {
        afterCreate: ["npm install"],
      },
    };

    vi.mocked(fs.access).mockResolvedValue(undefined);
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(customConfig));

    const config = await loadConfig(repoRoot);

    expect(config.worktreesDir).toBe("./custom-worktrees");
    expect(config.branchPrefix).toBe("task");
    expect(config.hooks?.afterCreate).toContain("npm install");
  });

  it("merges partial config with defaults", async () => {
    const partialConfig = {
      branchPrefix: "dev",
    };

    vi.mocked(fs.access).mockResolvedValue(undefined);
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(partialConfig));

    const config = await loadConfig(repoRoot);

    expect(config.branchPrefix).toBe("dev");
    expect(config.worktreesDir).toBe("./worktrees"); // Default
    expect(config.terminal).toBe("wezterm"); // Default
  });

  it("returns defaults on invalid JSON", async () => {
    vi.mocked(fs.access).mockResolvedValue(undefined);
    vi.mocked(fs.readFile).mockResolvedValue("invalid json");

    const config = await loadConfig(repoRoot);

    expect(config).toEqual(DEFAULT_CONFIG);
  });

  it("returns defaults on validation failure", async () => {
    const invalidConfig = {
      terminal: "unsupported-terminal",
    };

    vi.mocked(fs.access).mockResolvedValue(undefined);
    vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(invalidConfig));

    const config = await loadConfig(repoRoot);

    expect(config).toEqual(DEFAULT_CONFIG);
  });
});
