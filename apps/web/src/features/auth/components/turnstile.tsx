import { t } from "@lingui/core/macro";
import { useEffect, useRef, useState } from "react";
import { Button } from "@reactive-resume/ui/components/button";

type TurnstileOptions = {
	sitekey: string;
	action: string;
	theme: "auto";
	size: "flexible";
	callback: (token: string) => void;
	"expired-callback": () => void;
	"error-callback": () => void;
	"timeout-callback": () => void;
};

type TurnstileApi = {
	ready: (callback: () => void) => void;
	render: (container: HTMLElement, options: TurnstileOptions) => string;
	remove: (widgetId: string) => void;
};

declare global {
	interface Window {
		turnstile?: TurnstileApi;
	}
}

let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
	if (window.turnstile) return Promise.resolve(window.turnstile);
	if (scriptPromise) return scriptPromise;

	scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
		const script = document.createElement("script");
		script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
		script.async = true;
		const failed = () => {
			clearTimeout(timeout);
			script.remove();
			reject(new Error("Turnstile script unavailable"));
		};
		const timeout = setTimeout(failed, 20_000);
		script.onerror = failed;
		script.onload = () => {
			if (!window.turnstile) return failed();
			clearTimeout(timeout);
			resolve(window.turnstile);
		};
		document.head.append(script);
	}).catch((error: unknown) => {
		scriptPromise = null;
		throw error;
	});

	return scriptPromise;
}

type TurnstileProps = {
	siteKey: string;
	onToken: (token: string | null) => void;
	resetKey: number;
};

export function Turnstile({ siteKey, onToken, resetKey }: TurnstileProps) {
	const container = useRef<HTMLDivElement>(null);
	const [failed, setFailed] = useState(false);
	const [retry, setRetry] = useState(0);

	useEffect(() => {
		let active = true;
		let api: TurnstileApi | undefined;
		let widgetId: string | undefined;
		onToken(null);
		const fail = () => {
			if (!active) return;
			onToken(null);
			setFailed(true);
		};

		void loadTurnstile()
			.then((loadedApi) => {
				if (!active) return;
				setFailed(false);
				api = loadedApi;
				api.ready(() => {
					if (!active || !container.current) return;
					try {
						widgetId = loadedApi.render(container.current, {
							sitekey: siteKey,
							action: "account",
							theme: "auto",
							size: "flexible",
							callback: (token) => {
								if (!active) return;
								setFailed(false);
								onToken(token);
							},
							"expired-callback": () => {
								if (active) onToken(null);
							},
							"error-callback": fail,
							"timeout-callback": fail,
						});
					} catch {
						fail();
					}
				});
			})
			.catch(fail);

		return () => {
			active = false;
			if (widgetId !== undefined) api?.remove(widgetId);
		};
	}, [siteKey, onToken, resetKey, retry]);

	return (
		<div className="space-y-2">
			<div
				ref={container}
				className="min-h-[65px]"
				aria-label={t({ id: "auth.securityCheck", message: "Security check" })}
			/>
			{failed && (
				<div role="alert" className="space-y-2 text-sm">
					<p>{t({ id: "auth.securityCheckFailed", message: "Security check failed to load. Please try again." })}</p>
					<Button type="button" variant="secondary" size="sm" onClick={() => setRetry((attempt) => attempt + 1)}>
						{t({ id: "auth.retrySecurityCheck", message: "Retry security check" })}
					</Button>
				</div>
			)}
		</div>
	);
}
