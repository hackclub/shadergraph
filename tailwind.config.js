import aspectRatio from "@tailwindcss/aspect-ratio";
import containerQueries from "@tailwindcss/container-queries";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],

	theme: {
		extend: {
			keyframes: {
				wave: {
					from: { transform: "rotate(0deg)" },
					to: { transform: "rotate(-5deg)" }
				}
			},
			animation: {
				wave: "wave 0.2s ease-in-out infinite alternate"
			}
		}
	},

	plugins: [typography, forms, containerQueries, aspectRatio]
};
