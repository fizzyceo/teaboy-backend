import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";

@Injectable()
export class EncryptionService {
  private readonly algorithm = "aes-256-gcm";
  private readonly secretKey = crypto.scryptSync(
    "your-secret-key-32-characters-long",
    "salt",
    32
  ); // Ensure the key is 32 bytes long
  private readonly ivLength = 12; // Shorter IV for AES-GCM

  // Convert Base64 to Base64 URL
  private toBase64Url(base64: string): string {
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  // Convert Base64 URL to Base64
  private fromBase64Url(base64Url: string): string {
    return base64Url.replace(/-/g, "+").replace(/_/g, "/").concat("=");
  }

  encryptData(menuId: string, spaceId: string): string {
    const iv = crypto.randomBytes(this.ivLength); // Generate a random IV
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);

    const data = `${menuId}-${spaceId}`;
    let encrypted = cipher.update(data, "utf8", "base64");
    encrypted += cipher.final("base64");

    const authTag = cipher.getAuthTag().toString("base64");

    return `${this.toBase64Url(iv.toString("base64"))}:${this.toBase64Url(authTag)}:${this.toBase64Url(encrypted)}`;
  }

  decryptData(encryptedData: string): string {
    const [iv, authTag, encrypted] = encryptedData.split(":");
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.secretKey,
      Buffer.from(this.fromBase64Url(iv), "base64")
    );
    decipher.setAuthTag(Buffer.from(this.fromBase64Url(authTag), "base64"));

    let decrypted = decipher.update(
      this.fromBase64Url(encrypted),
      "base64",
      "utf8"
    );
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}
