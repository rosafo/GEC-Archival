<script lang="ts">
	import { page } from '$app/stores';
	import Election from '$modules/elections/index.svelte';

	$: electionId = $page.params.electionId;
</script>

<Election {electionId} />
