import { createFileRoute } from "@tanstack/react-router";
import { appUrl } from "@reactive-resume/utils/brand";
import { PrivacyPage } from "@/features/privacy/page";
import { getPrivacyMeta } from "@/libs/seo";

export const Route = createFileRoute("/_home/privacy")({
	component: PrivacyPage,
	head: () => {
		const canonicalUrl = new URL(
			"/privacy",
			typeof window === "undefined" ? appUrl : window.location.origin,
		).toString();
		return {
			meta: [{ title: getPrivacyMeta().title }, { name: "description", content: getPrivacyMeta().description }],
			links: [{ rel: "canonical", href: canonicalUrl }],
		};
	},
});
