import { appDescription, appName, appUrl, repositoryUrl } from "@reactive-resume/utils/brand";

const productionRootUrl = `${appUrl}/`;

type JsonLd = Record<string, unknown>;

export const getCanonicalRootUrl = (origin?: string): string => {
	if (!origin) return productionRootUrl;

	const url = new URL(origin);
	url.pathname = "/";
	url.search = "";
	url.hash = "";

	return url.toString();
};

export const createNoindexFollowMeta = () => ({ name: "robots", content: "noindex, follow" });

type ResumeSocialMetaOptions = {
	canonicalUrl: string;
	title: string;
	description: string;
	imageUrl: string;
};

export const createResumeSocialMeta = ({ canonicalUrl, title, description, imageUrl }: ResumeSocialMetaOptions) => [
	{ property: "og:type", content: "profile" },
	{ property: "og:title", content: title },
	{ property: "og:description", content: description },
	{ property: "og:url", content: canonicalUrl },
	{ property: "og:image", content: imageUrl },
	// X only reads these as `name`, not `property`
	{ name: "twitter:card", content: "summary_large_image" },
	{ name: "twitter:url", content: canonicalUrl },
	{ name: "twitter:title", content: title },
	{ name: "twitter:description", content: description },
	{ name: "twitter:image", content: imageUrl },
];

const serializeJsonLdForScript = (data: JsonLd) =>
	JSON.stringify(data).replace(/[<>&\u2028\u2029]/g, (character) => {
		switch (character) {
			case "<":
				return "\\u003C";
			case ">":
				return "\\u003E";
			case "&":
				return "\\u0026";
			case "\u2028":
				return "\\u2028";
			case "\u2029":
				return "\\u2029";
			default:
				return character;
		}
	});

const createStructuredDataScript = (id: string, data: JsonLd) => ({
	id,
	type: "application/ld+json",
	children: serializeJsonLdForScript(data),
});

export const getRootStructuredData = (canonicalUrl: string): JsonLd[] => [
	{
		"@type": "WebSite",
		name: appName,
		url: canonicalUrl,
	},
	{
		"@type": ["SoftwareApplication", "WebApplication"],
		name: appName,
		url: canonicalUrl,
		description: appDescription,
		applicationCategory: "BusinessApplication",
		operatingSystem: "Web",
		isAccessibleForFree: true,
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
		},
		codeRepository: repositoryUrl,
	},
	{
		"@type": "Project",
		name: appName,
		url: canonicalUrl,
		sameAs: [repositoryUrl],
	},
];

export const createRootStructuredDataScript = (canonicalUrl: string) =>
	createStructuredDataScript("reactive-resume-structured-data", {
		"@context": "https://schema.org",
		"@graph": getRootStructuredData(canonicalUrl),
	});
