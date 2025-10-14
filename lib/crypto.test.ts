import { describe, it, expect } from "vitest";
import { encrypt, decrypt } from "./crypto";

describe("crypto", () => {
	it("should encrypt and decrypt back to original text", () => {
		const text = "hello world";
		const encrypted = encrypt(text);
		const decrypted = decrypt(encrypted);
		expect(decrypted).toBe(text);
	});

	it("should produce different encrypted strings for the same input", () => {
		const text = "test";
		const encrypted1 = encrypt(text);
		const encrypted2 = encrypt(text);
		expect(encrypted1).not.toBe(encrypted2);
		expect(decrypt(encrypted1)).toBe(text);
		expect(decrypt(encrypted2)).toBe(text);
	});
});
