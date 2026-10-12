// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import { render } from "react-email";

vi.mock("@reactive-resume/env/server", () => ({ env: { APP_URL: "https://resume.afeiii.com" } }));

const { ResetPasswordEmail, VerifyEmail, VerifyEmailChange } = await import("./auth");
const url = "https://resume.afeiii.com/auth/reset-password?token=test-only&redirect=%2Fdashboard";

describe("Chinese authentication emails", () => {
	it.each([
		{ name: "reset password", element: <ResetPasswordEmail url={url} />, label: "设置新密码" },
		{ name: "verify email", element: <VerifyEmail url={url} />, label: "验证邮箱" },
		{
			name: "change email",
			element: <VerifyEmailChange url={url} previousEmail="old@example.com" newEmail="new@example.com" />,
			label: "验证新邮箱",
		},
	])("renders $name with the site identity and preserves the action URL", async ({ element, label }) => {
		const html = await render(element);
		const text = await render(element, { plainText: true });
		expect(html).toContain('lang="zh-CN"');
		expect(html).toContain("十三月简历");
		expect(html).toContain("https://resume.afeiii.com/icon/dark.svg");
		expect(html).not.toContain("https://rxresu.me");
		expect(text).toContain(label);
		expect(text).toContain(url);
	});

	it("escapes email addresses inside the email-change message", async () => {
		const html = await render(
			<VerifyEmailChange url={url} previousEmail="old@example.com" newEmail='<script>alert("test")</script>' />,
		);
		expect(html).not.toContain('<script>alert("test")</script>');
		expect(html).toContain("&lt;script&gt;");
	});
});
