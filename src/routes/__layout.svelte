<script lang="ts">
	import { goto } from '$app/navigation';
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
	import { userAuth, loading } from '$lib/Store.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner.svelte'
import { onMount } from 'svelte';
import isToken from '$lib/helper/isToken';
if ($userAuth){ 
				loading.set(false)
			}
	onMount(
		()=>{
			
			if (!($userAuth)){
				userAuth.set(isToken())
			}
			if ($userAuth){ 
				loading.set(false)
				return true
			}
			goto("/login")

		}
	)


</script>

<LoadingSpinner />
<Header />

<main>
	<slot />
</main>

<footer>Haurhi is a project by FlaminDemigod.</footer>

<style>
</style>
