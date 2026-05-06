import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import path from "path";

let cachedClient: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set to use Supabase Storage uploads.",
    );
  }
  cachedClient = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedClient;
}

function getBucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET ?? "photos";
}

function safeFilename(original: string): string {
  const ext = path.extname(original).toLowerCase().replace(/[^a-z0-9.]/g, "");
  return `${randomUUID()}${ext}`;
}

export async function uploadPhotoToBucket(
  buffer: Buffer,
  originalName: string,
  contentType: string,
): Promise<string> {
  const client = getClient();
  const bucket = getBucket();
  const objectKey = safeFilename(originalName);

  const { error } = await client.storage.from(bucket).upload(objectKey, buffer, {
    contentType,
    cacheControl: "public, max-age=31536000, immutable",
    upsert: false,
  });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data } = client.storage.from(bucket).getPublicUrl(objectKey);
  if (!data?.publicUrl) {
    throw new Error("Supabase upload succeeded but no public URL was returned.");
  }
  return data.publicUrl;
}
