import { storage } from "./storage";
import { hashPassword } from "./auth";

// Creates the initial admin account from environment variables on first startup.
// Set INITIAL_ADMIN_USERNAME and INITIAL_ADMIN_PASSWORD before the first deploy,
// then unset them. Subsequent restarts are no-ops.
export async function ensureInitialAdmin(): Promise<void> {
  const username = process.env.INITIAL_ADMIN_USERNAME;
  const password = process.env.INITIAL_ADMIN_PASSWORD;

  if (!username || !password) {
    return;
  }

  const existing = await storage.getUserByUsername(username);
  if (existing) {
    return;
  }

  const hashedPassword = await hashPassword(password);
  await storage.createUser({
    username,
    password: hashedPassword,
    isAdmin: true,
  });

  console.log(`[bootstrap] Created initial admin user "${username}". Unset INITIAL_ADMIN_PASSWORD now.`);
}
