// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt@0.33.1/mod.ts";

await emptyDir("./npm");

await build({
	entryPoints: ["./index.ts"],
	outDir: "./npm",
	shims: { deno: { test: true } },
	package: {
		name: "promise.object",
		version: Deno.args[0],
		description: "Deep resolve promises in objects.",
		keywords: ["Promise", "A+", "objects", "deep resolve"],
		author: "Muthu Kumar <@MKRhere> (https://mkr.pw)",
		contributors: ["Thomas Rory Gummerson <@TRGWII> (https://rory.no)"],
		repository: { type: "git", url: "git+https://github.com/codefeathers/Promise.object.git" },
		bugs: { url: "https://github.com/codefeathers/Promise.object/issues" },
		homepage: "https://github.com/codefeathers/Promise.object#readme",
		license: "MIT",
	},
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
