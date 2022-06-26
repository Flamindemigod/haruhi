<script>
	import { page } from '$app/stores';
	import Ripple from '@smui/ripple';
	import Paper from "@smui/paper";
</script>

<Paper class="flex justify-around text-xl">
	<!-- home anime calender             user avatar         -->
	<nav>
		<ul class="flex gap-6">
			<li class:active={$page.url.pathname === '/'}>
				<a
					class="light:text-black dark:text-white"
					use:Ripple={{ surface: true }}
					sveltekit:prefetch
					href="/">Home</a
				>
			</li>
			<li class:active={$page.url.pathname === '/anime'}>
				<a
					class="light:text-black dark:text-white"
					use:Ripple={{ surface: true }}
					sveltekit:prefetch
					href="/anime">Anime</a
				>
			</li>
			<li class:active={$page.url.pathname === '/calender'}>
				<a
					class="light:text-black dark:text-white"
					use:Ripple={{ surface: true }}
					sveltekit:prefetch
					href="/login">Calender</a
				>
			</li>
		</ul>
	</nav>
    <div class=""></div>
</Paper>

<style>
    ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 4em;
		display: flex;
		background: var(--background);
		background-size: contain;
	}
	li {
		position: relative;
		height: 100%;
	}

	li.active::before {
		--size: 6px;
		content: '';
		width: 2px;
		height: 2px;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--clr-primary);
	}
</style>
