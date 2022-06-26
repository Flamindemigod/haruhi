<script lang="ts" context="module">
    import { writable } from 'svelte/store';
    export const userAuth = writable(false);
    export const loading = writable(true);

</script>