import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import type { StorageSettings } from "@/types";

// ===== S3 Client Cache (tenant bazlı) =====
const s3Cache = new Map<string, S3Client>();

function getS3(config?: StorageSettings["r2"]): S3Client {
  const accountId = config?.accountId || process.env.R2_ACCOUNT_ID;
  const accessKeyId = config?.accessKeyId || process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = config?.secretAccessKey || process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId) {
    throw new Error(
      "R2_ACCOUNT_ID ayarlanmamis. Admin panelinden Depolama ayarlarindan R2 bilgilerinizi girin veya .env.local dosyanizi kontrol edin."
    );
  }
  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2 Access Key bilgileri eksik. Admin panelinden Depolama ayarlarindan R2 bilgilerinizi girin veya .env.local dosyanizi kontrol edin."
    );
  }

  const cacheKey = `${accountId}:${accessKeyId}`;
  let client = s3Cache.get(cacheKey);
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
    s3Cache.set(cacheKey, client);
  }
  return client;
}

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export interface UploadResult {
  url: string;
  key: string;
  fileName: string;
  mimeType: string;
  size: number;
}

function validateFile(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Desteklenmeyen dosya tipi: ${file.type}`);
  }
  if (file.size > MAX_SIZE) {
    throw new Error(`Dosya boyutu cok buyuk (maks ${MAX_SIZE / 1024 / 1024}MB)`);
  }
}

// ===== R2 Upload =====
export async function uploadToR2(
  file: File,
  folder: string = "general",
  r2Config?: StorageSettings["r2"]
): Promise<UploadResult> {
  validateFile(file);

  const bucket = r2Config?.bucketName || process.env.R2_BUCKET_NAME || "dernekpro";
  const publicUrl = (r2Config?.publicUrl || process.env.R2_PUBLIC_URL || "").replace(/\/+$/, "");

  if (!publicUrl) {
    throw new Error(
      "R2 Public URL ayarlanmamis. Admin panelinden Ayarlar > Depolama bölümünden R2 Public URL'yi girin veya R2_PUBLIC_URL ortam degiskenini ayarlayin."
    );
  }

  const ext = file.name.split(".").pop() || "bin";
  const key = `${folder}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await getS3(r2Config).send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return {
    url: `${publicUrl}/${key}`,
    key,
    fileName: file.name,
    mimeType: file.type,
    size: file.size,
  };
}

export async function deleteFromR2(key: string, r2Config?: StorageSettings["r2"]): Promise<void> {
  const bucket = r2Config?.bucketName || process.env.R2_BUCKET_NAME || "dernekpro";
  await getS3(r2Config).send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}

// ===== Local Upload =====
export async function uploadToLocal(
  file: File,
  folder: string = "general"
): Promise<UploadResult> {
  validateFile(file);

  const ext = file.name.split(".").pop() || "bin";
  const fileName = `${randomUUID()}.${ext}`;
  const key = `uploads/${folder}/${fileName}`;
  const dirPath = path.join(process.cwd(), "public", "uploads", folder);
  const filePath = path.join(dirPath, fileName);

  await mkdir(dirPath, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return {
    url: `/${key}`,
    key,
    fileName: file.name,
    mimeType: file.type,
    size: file.size,
  };
}

export async function deleteFromLocal(key: string): Promise<void> {
  const filePath = path.join(process.cwd(), "public", key);
  try {
    await unlink(filePath);
  } catch {
    // Dosya zaten silinmiş olabilir
  }
}

// ===== Provider-Aware Helpers =====
async function getStorageConfig(tenantId: string): Promise<StorageSettings> {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { settings: true },
  });
  const settings = (tenant?.settings as Record<string, unknown>) || {};
  const storage = settings.storage as StorageSettings | undefined;
  return storage || { provider: "r2" };
}

export async function uploadFile(
  file: File,
  folder: string,
  tenantId: string
): Promise<UploadResult> {
  const config = await getStorageConfig(tenantId);
  if (config.provider === "local") {
    return uploadToLocal(file, folder);
  }
  return uploadToR2(file, folder, config.r2);
}

export async function deleteFile(key: string, tenantId: string): Promise<void> {
  const config = await getStorageConfig(tenantId);
  if (config.provider === "local") {
    return deleteFromLocal(key);
  }
  return deleteFromR2(key, config.r2);
}
