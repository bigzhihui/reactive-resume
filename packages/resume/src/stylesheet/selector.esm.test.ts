import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

describe("semantic selector native ESM compatibility", () => {
	it("loads the selector module through Node and tsx", () => {
		const entry = new URL("./selector.ts", import.meta.url).href;
		const packageRoot = fileURLToPath(new URL("../../", import.meta.url));
		const result = spawnSync(
			process.execPath,
			["--import", "tsx", "--input-type=module", "--eval", `import(${JSON.stringify(entry)})`],
			{
				cwd: packageRoot,
				encoding: "utf8",
			},
		);

		expect({ status: result.status, stderr: result.stderr }).toEqual({ status: 0, stderr: "" });
	});
});
