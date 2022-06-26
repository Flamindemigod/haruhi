<script lang="ts">
	import { userAuth, loading } from '$lib/Store.svelte';
    
    import AnilistLogin from "$lib/AnilistLogin/AnilistLogin.svelte";
import { onMount } from 'svelte';
loading.set(false)
</script>

<AnilistLogin></AnilistLogin>