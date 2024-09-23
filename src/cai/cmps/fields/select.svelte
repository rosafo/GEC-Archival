<script lang="ts">
	import ComponentRenderer from '$cai/ComponentRenderer.svelte';
	import type { IParsedComponent } from '$cai/types';
	import Select from '$cmps/forms/selectField.svelte';

	export let contextKey: symbol;
	export let children: IParsedComponent[] = [];
	export let options: any[] = [];
	export let dataSource: IDataSource | null = null;
	// todo: support queries
	// todo: support function names
	// todo: support cascading dropdowns
	// todo: raise events
	// todo: get current values
	$: if (dataSource) {
		if (dataSource.options) {
			options = dataSource.options;
		} else if (dataSource.fn) {
			// todo: call function and pass (dataSource, values)
		} else if (dataSource.rest) {
			// todo: call rest with provided details
		} else if (dataSource.query) {
			// todo: make the gql call
		}
	}
	// $: console.log({options, props: $$props})
</script>

<Select {options} {...$$restProps} {contextKey} />
{#each children || [] as child}
	<ComponentRenderer defn={child} {contextKey} />
{/each}
