<script lang="ts">
    import { loading } from "./Store.svelte";
    import { Circle3 } from 'svelte-loading-spinners'
</script>


{#if $loading}
<div class="fixed inset-0 z-50 flex flex-col justify-center items-center bg-gradient-to-br from-primary-100 to-secondary-300">
    <Circle3 size="100" unit="px"></Circle3>
</div>
{/if}