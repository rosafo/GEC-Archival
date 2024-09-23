<script lang="ts">
	import type { IParsedComponent } from '$cai/types';
	import DateField from '$cmps/forms/dateField.svelte';
	import ComponentRenderer from '$cai/ComponentRenderer.svelte';

	export let contextKey: symbol;
	export let children: IParsedComponent[] = [];
</script>

<DateField {...$$restProps} {contextKey} />
{#each children || [] as child}
	<ComponentRenderer defn={child} {contextKey} />
{/each}
