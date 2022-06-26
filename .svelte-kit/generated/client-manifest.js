export { matchers } from './client-matchers.js';

export const components = [
	() => import("../../src/routes/__layout.svelte"),
	() => import("../runtime/components/error.svelte"),
	() => import("../../src/routes/anime.svelte"),
	() => import("../../src/routes/callback.svelte"),
	() => import("../../src/routes/index.svelte"),
	() => import("../../src/routes/login/index.svelte")
];

export const dictionary = {
	"": [[0, 4], [1]],
	"anime": [[0, 2], [1]],
	"callback": [[0, 3], [1]],
	"login": [[0, 5], [1]]
};