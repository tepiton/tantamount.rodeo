export default {
	// Site metadata
	title: "pborenstein.dev",
	url: "https://pborenstein.dev/",
	language: "en",
	description: "I take things apart to understand how they work, then write about what I learned. Mostly Git, static sites, LLMs, and the occasional CSS hack.",
	tagline: "Taking things apart to see how they work.",

	// Author information
	author: {
		name: "Philip Borenstein",
		email: "pborenstein@gmail.com",
		url: "https://pborenstein.dev/about/",
		social: {
			github: "pborenstein",
			bluesky: "@pborenstein.dev"
		}
	},

	// Feed configuration
	feed: {
		subtitle: "Taking things apart to see how they work.",
		path: "/feed/feed.xml",
		id: "https://pborenstein.dev/",
		limit: 10
	},

	// Build configuration
	build: {
		environment: process.env.ELEVENTY_ENV || "development"
	}
}
