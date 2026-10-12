import * as React from "react";
import {
	Body,
	Button,
	Container,
	Font,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	pixelBasedPreset,
	Section,
	Tailwind,
	Text,
} from "react-email";
import { env } from "@reactive-resume/env/server";
import { appName, supportEmail } from "@reactive-resume/utils/brand";

// ponytail: server dev consumes this source through tsx, which emits React.createElement here.
void React;

const logoUrl = new URL("/icon/dark.svg", env.APP_URL).toString();

interface AuthEmailLayoutProps {
	preview: string;
	heading: string;
	intro: string;
	details?: string;
	actionLabel: string;
	actionUrl: string;
	outro: string;
}

function AuthEmailLayout({ preview, heading, intro, details, actionLabel, actionUrl, outro }: AuthEmailLayoutProps) {
	return (
		<Html lang="zh-CN">
			<Tailwind
				config={{
					presets: [pixelBasedPreset],
					theme: {
						fontFamily: {
							body: ["IBM Plex Sans", "sans-serif"],
							heading: ["IBM Plex Sans Condensed", "sans-serif"],
						},
					},
				}}
			>
				<Head>
					<Font
						fontFamily="IBM Plex Sans Condensed"
						fallbackFontFamily="sans-serif"
						fontWeight={500}
						fontStyle="normal"
						webFont={{
							url: "https://fonts.gstatic.com/s/ibmplexsans/v23/zYXGKVElMYYaJe8bpLHnCwDKr932-G7dytD-DmvrswZSAXcomDVmadSD2FlDB6g4tIOm6_De.woff2",
							format: "woff2",
						}}
					/>
					<Font
						fontFamily="IBM Plex Sans"
						fallbackFontFamily="sans-serif"
						fontWeight={400}
						fontStyle="normal"
						webFont={{
							url: "https://fonts.gstatic.com/s/ibmplexsans/v23/zYXGKVElMYYaJe8bpLHnCwDKr932-G7dytD-Dmu1swZSAXcomDVmadSD6llDB6g4tIOm6_De.woff2",
							format: "woff2",
						}}
					/>
				</Head>

				<Body className="font-body m-0 bg-zinc-950 p-0 text-sm text-zinc-50">
					<Preview>{preview}</Preview>
					<Container className="mx-auto w-full max-w-xl bg-zinc-900 p-6 text-zinc-50">
						<Section>
							<Img src={logoUrl} alt={appName} width="48" height="48" className="block" />
						</Section>

						<Section className="mt-6">
							<Heading className="font-heading text-2xl leading-normal font-medium tracking-tighter whitespace-break-spaces md:text-5xl">
								{heading}
							</Heading>

							<Section className="mt-6 md:mt-12">
								<Text>{intro}</Text>

								{details ? <Text className="opacity-60">{details}</Text> : null}
							</Section>

							<Button
								target="_blank"
								href={actionUrl}
								className="mt-6 box-border inline-block bg-zinc-200 px-6 py-3 text-center text-zinc-900 no-underline"
							>
								{actionLabel}
							</Button>

							<Section className="mt-8">
								<Text className="leading-relaxed">如果按钮无法打开，请将下面的链接复制到浏览器：</Text>
								<Link className="leading-relaxed text-zinc-200/60 underline underline-offset-2" href={actionUrl}>
									{actionUrl}
								</Link>
							</Section>

							<Section className="mt-4">
								<Text className="opacity-60">{outro}</Text>
							</Section>

							<Hr className="my-10 border-zinc-700" />

							<Text className="mt-8 text-xs leading-relaxed opacity-60">
								联系与反馈：<Link href={`mailto:${supportEmail}`}>{supportEmail}</Link>
							</Text>
							<Text className="mt-8 text-xs leading-1 opacity-40">By the community, for the community.</Text>
							<Text className="text-xs leading-1 opacity-40">
								A passion project by{" "}
								<Link
									target="_blank"
									rel="noopener noreferrer"
									href="https://amruthpillai.com"
									className="text-inherit underline underline-offset-2"
								>
									Amruth Pillai
								</Link>
								.
							</Text>

							<Text className="font-heading mt-8 text-base font-medium tracking-tight opacity-80">{appName}</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

interface ResetPasswordEmailProps {
	url: string;
}

export function ResetPasswordEmail({ url }: ResetPasswordEmailProps) {
	return (
		<AuthEmailLayout
			preview={`重置你的${appName}密码`}
			heading="重置密码"
			intro={`我们收到了重置你的${appName}账号密码的请求。`}
			details="如果不是你本人操作，请忽略这封邮件，你的密码不会改变。"
			actionLabel="设置新密码"
			actionUrl={url}
			outro={`请确认链接指向${env.APP_URL}，再进行操作。`}
		/>
	);
}

interface VerifyEmailProps {
	url: string;
}

export function VerifyEmail({ url }: VerifyEmailProps) {
	return (
		<AuthEmailLayout
			preview={`验证你的${appName}邮箱`}
			heading="验证邮箱"
			intro={`欢迎使用${appName}。请验证你的邮箱地址，完成账号验证。`}
			details="验证邮箱可帮助保护账号，并在忘记密码时找回账号。"
			actionLabel="验证邮箱"
			actionUrl={url}
			outro="如果你没有注册这个账号，请忽略这封邮件。"
		/>
	);
}

interface VerifyEmailChangeProps {
	url: string;
	previousEmail: string;
	newEmail: string;
}

export function VerifyEmailChange({ url, previousEmail, newEmail }: VerifyEmailChangeProps) {
	return (
		<AuthEmailLayout
			preview={`确认你的${appName}新邮箱`}
			heading="确认更换邮箱"
			intro={`你申请将${appName}的账号邮箱从 ${previousEmail} 更换为 ${newEmail}。`}
			details="完成下面的验证后，新邮箱才会生效。"
			actionLabel="验证新邮箱"
			actionUrl={url}
			outro="如果不是你本人申请，请忽略这封邮件。未完成验证时，账号邮箱不会改变。"
		/>
	);
}
