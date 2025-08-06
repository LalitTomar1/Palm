import { ViteDevServer } from "vite";
import express from "express";
import { Server } from "http";

export const log = (message: string) => {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  console.log(`${formattedTime} [express] ${message}`);
};

export async function setupVite(app: express.Application, server: Server) {
  const vite = await (
    await import("vite")
  ).createServer({
    server: { middlewareMode: true },
    appType: "spa",
  });

  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);
}

export function serveStatic(app: express.Application) {
  const distPath = new URL("../dist/public", import.meta.url).pathname;
  app.use(express.static(distPath));
  
  // Handle client-side routing
  app.get("*", (req, res) => {
    res.sendFile(new URL("../dist/public/index.html", import.meta.url).pathname);
  });
}