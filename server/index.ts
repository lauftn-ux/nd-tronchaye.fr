import { createServer } from "http";
import express from "express";
import { getApp } from "./app.js";
import { setupVite, serveStatic, log } from "./vite.js";

const port = Number(process.env.PORT ?? 5000);

(async () => {
  const app = await getApp();

  // In dev, also serve files from /public (the .webp images, logos, etc.) so
  // they're available alongside the Vite dev server. Vite's publicDir handles
  // this in production builds.
  app.use(express.static("public"));

  const server = createServer(app);

  if (process.env.NODE_ENV !== "production") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  server.listen({ port, host: "0.0.0.0" }, () => {
    log(`serving on port ${port}`);
  });
})();
