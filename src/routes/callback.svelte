
<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { userAuth , loading} from '$lib/Store.svelte';
	loading.set(true)
	onMount(()=> {
		let hash: string = $page.url.hash.substr(1);
		// Looping through it and making an array
		let result: any = hash.split('&').reduce(function (res, item) {
			let parts: any = item.split('=');
			res[parts[0]] = parts[1];
			return res;
		}, {});

		// Storing access_token and expires_in to variables (We got these from the URL fragment)
		let access_token = result['access_token'],
			expires_in = result['expires_in'];

		const d = new Date();
		d.setTime(d.getTime() + expires_in * 1000);
		
        document.cookie = 'access_token=' + access_token + ';expires=' + d.toUTCString() + ';path=/';
		userAuth.set(true);
		//Redirect To home
		goto('/');
	})
</script>
