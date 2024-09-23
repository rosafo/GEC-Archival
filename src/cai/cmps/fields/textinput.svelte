<script lang="ts">
	import ComponentRenderer from '$cai/ComponentRenderer.svelte';
	import type { IParsedComponent } from '$cai/types';
	import TextInput from '$cmps/forms/textField.svelte';

	export let contextKey: symbol;
	export let children: IParsedComponent[] = [];
</script>

<TextInput {...$$restProps} {contextKey} />
{#each children || [] as child}
	<ComponentRenderer defn={child} {contextKey} />
{/each}
