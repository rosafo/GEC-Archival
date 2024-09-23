<script lang="ts">
	import ComponentRenderer from '$cai/ComponentRenderer.svelte';
	import type { IParsedComponent } from '$cai/types';
	import TextAreaInput from '$cmps/forms/textAreaField.svelte';

	export let contextKey: symbol;
	export let children: IParsedComponent[] = [];
</script>

<TextAreaInput {...$$restProps} {contextKey} />
{#each children || [] as child}
	<ComponentRenderer defn={child} {contextKey} />
{/each}
