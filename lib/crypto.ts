import * as crypto from "crypto";

const algorithm = "aes-256-cbc";
const secret = process.env.SECRET ?? "default_secret_key_for_demo_only";

const key = crypto.createHash("sha256").update(secret).digest();

export function encrypt(text: string): string {
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(algorithm, key, iv);
	const encrypted = Buffer.concat([
		cipher.update(text, "utf8"),
		cipher.final(),
	]);
	return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(encryptedText: string): string {
	const [ivHex, dataHex] = encryptedText.split(":");
	if (!ivHex || !dataHex) throw new Error("Invalid encrypted text format");

	const iv = Buffer.from(ivHex, "hex");
	const encryptedData = Buffer.from(dataHex, "hex");

	const decipher = crypto.createDecipheriv(algorithm, key, iv);
	const decrypted = Buffer.concat([
		decipher.update(encryptedData),
		decipher.final(),
	]);
	return decrypted.toString("utf8");
}
