import type { IncomingMessage, ServerResponse } from "http";
import { getApp } from "../server/app";

export const config = {
  // Use the Node.js runtime (not Edge) — Express, pg and Passport are not compatible with Edge.
  runtime: "nodejs",
  // Vercel default function memory is fine for this workload.
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const app = await getApp();
  return (app as unknown as (req: IncomingMessage, res: ServerResponse) => void)(req, res);
}
