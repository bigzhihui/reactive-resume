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
	render: (container: HTMLElement, options: TurnstileOptions) => string;
	remove: (widgetId: string) => void;
};

declare global {
	interface Window {
		turnstile?: TurnstileApi;
		onThirteenMonthTurnstileLoad?: () => void;
	}
}

let scriptPromise: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
	if (window.turnstile && typeof window.turnstile.render === "function") return Promise.resolve(window.turnstile);
	if (scriptPromise) return scriptPromise;

	scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
		let settled = false;
		const script = document.createElement("script");
		script.src =
			"https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onThirteenMonthTurnstileLoad";
		script.async = true;
		const failed = () => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			delete window.onThirteenMonthTurnstileLoad;
			script.remove();
			reject(new Error("Turnstile script unavailable"));
		};
		const timeout = setTimeout(failed, 20_000);
		script.onerror = failed;
		// api.js can be a bootstrap loader; its native load event may precede the real API.
		window.onThirteenMonthTurnstileLoad = () => {
			if (settled) return;
			if (!window.turnstile || typeof window.turnstile.render !== "function") return failed();
			settled = true;
			clearTimeout(timeout);
			delete window.onThirteenMonthTurnstileLoad;
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
				if (!container.current) return;
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
