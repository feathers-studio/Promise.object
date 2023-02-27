// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt@0.33.1/mod.ts";
import pkg from "./package.json" assert { type: "json" };

await emptyDir("./npm");

await build(
	Object.assign({
		entryPoints: ["./index.ts"],
		outDir: "./npm",
		shims: { deno: { test: true } },
		package: Object.assign(pkg, { version: Deno.args[0] }),
	}),
);

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
