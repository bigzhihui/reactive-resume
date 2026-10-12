import { createFileRoute } from "@tanstack/react-router";
import { appUrl, privacyDescription, privacyTitle } from "@reactive-resume/utils/brand";
import { PrivacyPage } from "@/features/privacy/page";

export const Route = createFileRoute("/_home/privacy")({
	component: PrivacyPage,
	head: () => {
		const canonicalUrl = new URL(
			"/privacy",
			typeof window === "undefined" ? appUrl : window.location.origin,
		).toString();
		return {
			meta: [{ title: privacyTitle }, { name: "description", content: privacyDescription }],
			links: [{ rel: "canonical", href: canonicalUrl }],
		};
	},
});
