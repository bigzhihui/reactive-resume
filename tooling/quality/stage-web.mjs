import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";

// Validation-only copy. These route aliases are never published or served.
const destination = process.argv[2];
if (!destination) throw Error("Supply a new temporary validation directory");
const root = resolve(destination);
await mkdir(root); // Refuse to replace an existing directory.
await cp("apps/web/dist", root, { recursive: true });
for (const page of ["home", "ats-checker", "privacy"]) {
	const directory = `apps/web/dist-prerender/${page}`;
	const pages = (await readdir(directory)).filter((name) => name.endsWith(".html"));
	if (pages.length < 55) throw Error(`Missing localized public pages: ${page}`);
	await cp(directory, join(root, "__prerender", page), { recursive: true });
}
const routes = await readFile("apps/web/src/routeTree.gen.ts", "utf8");
const manifest = routes.match(/export interface FileRoutesByFullPath \{([\s\S]*?)\n\}/)?.[1];
if (!manifest) throw Error("Missing generated route manifest");
const shell = await readFile("apps/web/dist/index.html");
for (const [, route] of manifest.matchAll(/^\s*"(\/[^"$]*)":/gm)) {
	if (route === "/") continue;
	const directory = resolve(root, "." + route);
	if (!directory.startsWith(root + "/") && !directory.startsWith(root + "\\")) throw Error("Invalid route");
	await mkdir(directory, { recursive: true });
	await writeFile(join(directory, "index.html"), shell, { flag: "wx" }).catch((error) => {
		if (error.code !== "EEXIST") throw error;
	});
}
console.log("Staged public prerenders, assets and known SPA routes for offline validation");
