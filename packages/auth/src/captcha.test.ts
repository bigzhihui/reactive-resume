import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createCaptchaPlugins } from "./captcha";

const settings = { appUrl: "https://resume.example.com", siteKey: "test-site-key", secretKey: "test-secret-key" };
const [plugin] = createCaptchaPlugins(settings);
if (!plugin) throw new Error("Captcha plugin must be configured for this test");
const logger = { warn: vi.fn(), error: vi.fn() };
const context = { options: { basePath: "/api/auth" }, logger } as unknown as Parameters<typeof plugin.onRequest>[1];
const fetchMock = vi.fn();

function request(path: string, token?: string) {
	return new Request(`${settings.appUrl}/api/auth${path}`, {
		method: "POST",
		headers: token ? { "x-captcha-response": token } : {},
	});
}

beforeEach(() => {
	vi.clearAllMocks();
	vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe("Turnstile auth enforcement", () => {
	it("leaves deployments without Turnstile unchanged", () => {
		expect(createCaptchaPlugins({ ...settings, siteKey: undefined, secretKey: undefined })).toEqual([]);
	});
	it.each(["/sign-up/email", "/request-password-reset"])(
		"rejects missing tokens at %s before contacting the provider",
		async (path) => {
			const result = await plugin.onRequest(request(path), context);
			expect(result?.response.status).toBe(400);
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
	it.each(["/sign-in/email", "/get-session", "/oauth2/token"])("keeps %s outside the captcha gate", async (path) => {
		expect(await plugin.onRequest(request(path), context)).toBeUndefined();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it("accepts a provider-verified token for the configured hostname and action", async () => {
		fetchMock.mockResolvedValue(Response.json({ success: true, hostname: "resume.example.com", action: "account" }));
		expect(await plugin.onRequest(request("/sign-up/email", "test-token"), context)).toBeUndefined();
		expect(fetchMock).toHaveBeenCalledOnce();
	});
	it.each([
		{ success: false, "error-codes": ["invalid-input-response"] },
		{ success: false, "error-codes": ["timeout-or-duplicate"] },
		{ success: true, hostname: "attacker.example.com", action: "account" },
		{ success: true, hostname: "resume.example.com", action: "unrelated" },
	])("rejects failed, consumed, or mismatched tokens (%j)", async (reply) => {
		fetchMock.mockResolvedValue(Response.json(reply));
		const result = await plugin.onRequest(request("/request-password-reset", "test-token"), context);
		expect(result?.response.status).toBe(403);
	});
	it("fails closed when provider verification is unavailable", async () => {
		fetchMock.mockResolvedValue(new Response("Unavailable", { status: 503 }));
		const result = await plugin.onRequest(request("/sign-up/email", "test-token"), context);
		expect(result?.response.status).toBe(500);
	});
});
