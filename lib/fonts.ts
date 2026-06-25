import localFont from "next/font/local";

export const roboto = localFont({
	src: [
		{
			path: "../app/fonts/roboto/Roboto-Variable.ttf",
			weight: "100 900",
			style: "normal",
		},
		{
			path: "../app/fonts/roboto/Roboto-Italic-Variable.ttf",
			weight: "100 900",
			style: "italic",
		},
	],
	variable: "--font-sans",
	display: "swap",
});
