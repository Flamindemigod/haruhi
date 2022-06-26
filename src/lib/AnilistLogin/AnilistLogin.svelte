<script lang="ts">
	import Button, { Label, Icon } from '@smui/button';
	import Logo from './AnilistIcon.svg?raw';
</script>

<div class="fixed inset-0 flex flex-col justify-center items-center bg-haruhi">
	<div
		class="bg-primary-100 flex flex-col justify-center items-center p-8 rounded-xl shadow-xl gap-4 max-w-max w-11/12 text-center"
	>
		<h1 class="text-3xl font-semibold">Meet Haruhi</h1>
		<p>A Svelte based Anime Streaming Service with Anilist Integration</p>
		<a
			class="bg-primary-300 p-2 rounded-md flex justify-center shadow-xl items-center"
			sveltekit:prefetch
			href="https://anilist.co/api/v2/oauth/authorize?client_id=8343&response_type=token"
		>
			<Label class="font-semibold">Login with Anilist</Label>
			<Icon class="h-8 inline-block">
				{@html Logo}
			</Icon>
		</a>
	</div>
</div>

<style>
	.bg-haruhi {
		background-image: url(bg-haruhi.jpg);
		object-fit: cover;
		background-repeat: no-repeat;
		background-attachment: fixed;
		background-position: center;
		box-shadow: inset 0 0 0 2000px rgba(0, 0, 0, 0.5);
	}
	:global(svg) {
		height: inherit;
		width: inherit;
	}
</style>
