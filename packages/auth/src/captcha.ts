import { captcha } from "better-auth/plugins";

type CaptchaSettings = {
	appUrl: string;
	siteKey: string | undefined;
	secretKey: string | undefined;
};

export function createCaptchaPlugins({ appUrl, siteKey, secretKey }: CaptchaSettings) {
	if (!siteKey || !secretKey) return [];

	return [
		captcha({
			provider: "cloudflare-turnstile",
			secretKey,
			endpoints: ["/sign-up/email", "/request-password-reset"],
			expectedAction: "account",
			allowedHostnames: [new URL(appUrl).hostname],
		}),
	];
}
