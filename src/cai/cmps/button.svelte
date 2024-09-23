<script lang="ts">
	import type { Emitter } from 'mitt';
	import Button from '$cmps/ui/button.svelte';
	import type { IParsedComponent } from '../types';
	import ComponentRenderer from '../ComponentRenderer.svelte';

	export let contextKey: symbol;
	export let children: IParsedComponent[] = [];
	export let emitter: Emitter<any> | null;
	export let cmd: { msg: string; args: any };

	function handleClick({ detail }: any) {
		emitter?.emit(cmd?.msg || 'buttonclick', cmd?.args);
	}
</script>

<Button {...$$restProps} {contextKey} on:click={handleClick} />
{#each children || [] as child}
	<ComponentRenderer defn={child} {contextKey} {emitter} />
{/each}
