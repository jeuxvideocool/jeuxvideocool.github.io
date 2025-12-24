import fs from "fs";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

type GameRegistryEntry = {
  id: string;
  title: string;
};

function loadGamesRegistry(): GameRegistryEntry[] {
  const registryPath = path.resolve(process.cwd(), "configs/games.registry.json");
  if (!fs.existsSync(registryPath)) return [];
  const raw = fs.readFileSync(registryPath, "utf-8");
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.games)) {
      return parsed.games.filter(
        (item) => typeof item.id === "string" && typeof item.title === "string",
      );
    }
  } catch (err) {
    console.error("Invalid games.registry.json", err);
  }
  return [];
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base =
    env.BASE_PATH ||
    env.VITE_BASE_PATH ||
    "/";

  const games = loadGamesRegistry();
  const input: Record<string, string> = {
    index: path.resolve(process.cwd(), "index.html"),
    hub: path.resolve(process.cwd(), "apps/hub/index.html"),
    alex: path.resolve(process.cwd(), "apps/alex/index.html"),
    hub_de_jeux: path.resolve(process.cwd(), "apps/hub_de_jeux/index.html"),
  };

  games.forEach((game) => {
    input[`game-${game.id}`] = path.resolve(
      process.cwd(),
      `apps/games/${game.id}/index.html`,
    );
  });

  return {
    base,
    plugins: [tsconfigPaths()],
    resolve: {
      alias: {
        "@core": path.resolve(process.cwd(), "packages/core/src"),
        "@storage": path.resolve(process.cwd(), "packages/storage/src"),
        "@progression": path.resolve(process.cwd(), "packages/progression/src"),
        "@config": path.resolve(process.cwd(), "packages/config/src"),
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      rollupOptions: {
        input,
      },
    },
    server: {
      open: "/",
    },
  };
});
