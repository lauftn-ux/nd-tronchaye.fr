import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { ensureInitialAdmin } from "./bootstrap";
import { seedSampleContentIfEmpty } from "./storage";

const SENSITIVE_LOG_PATHS = ["/api/login", "/api/user", "/api/admin"];

function logger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (!path.startsWith("/api")) return;

    const isSensitive = SENSITIVE_LOG_PATHS.some((p) => path.startsWith(p));
    let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
    if (capturedJsonResponse && !isSensitive) {
      logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
    }
    if (logLine.length > 200) logLine = logLine.slice(0, 199) + "…";
    console.log(`[express] ${logLine}`);
  });

  next();
}

let appPromise: Promise<express.Express> | null = null;

export function getApp(): Promise<express.Express> {
  if (!appPromise) {
    appPromise = (async () => {
      const app = express();

      app.set("trust proxy", 1);
      app.use(express.json({ limit: "1mb" }));
      app.use(express.urlencoded({ extended: false }));
      app.use(logger);

      await ensureInitialAdmin();
      await seedSampleContentIfEmpty().catch((err) => {
        console.error("[seed] failed to seed sample content:", err);
      });

      await registerRoutes(app);

      app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        console.error("[express]", err);
        if (!res.headersSent) {
          res.status(status).json({ message });
        }
      });

      return app;
    })();
  }
  return appPromise;
}
