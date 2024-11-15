import { paraglide } from "@inlang/paraglide-sveltekit/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		sveltekit(),
		enhancedImages(),
		paraglide({
			project: "./project.inlang",
			outdir: "./src/lib/paraglide"
		})
	]
});
