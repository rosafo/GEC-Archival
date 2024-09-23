<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import type { IComponent, IParsedComponent } from './types';
	import { resolveComponent } from './ComponentStore.svelte';
	import mitt from 'mitt';
	import type { Emitter } from 'mitt';

	export let defn: IParsedComponent;
	export let error: string = '';
	export let contextKey = Symbol('cmp');
	export let emitter: Emitter<any> | null;
	export let state: any = null;
	export let props: any = null;

	// let component: ConstructorOfATypedSvelteComponent | null
	// let props: any

	// function decode(descriptor: IComponent) {
	//   const component = resolveComponent(descriptor.type)
	//   const props = descriptor.props || {}
	//   return { component, props, children: descriptor.children }
	// }
	// $: {
	//   (component, props) = decode(descriptor)
	// }
	let disposeEmitter = false;
	const dispatch = createEventDispatcher();
	function dispatchEvent(type: any, e: any) {
		// console.log({ type, e })
		dispatch(type, e);
	}
	onMount(() => {
		if (emitter == null) {
			emitter = mitt();
			emitter.on('*', dispatchEvent);
			disposeEmitter = true;
		}
	});
	onDestroy(() => {
		if (disposeEmitter) {
			emitter.off('*', disposeEmitter);
		}
	});

	// $: console.log('defn', defn);
	// $: console.log('state', state);
	// $: console.log('config', config);
</script>

{#if defn?.type}
	<svelte:component
		this={defn.type}
		{...defn.props}
		{contextKey}
		{emitter}
		children={defn.children}
		{state}
	/>
{:else if error}
	<div class="">{error}</div>
{:else}
	<div class="">No valid definition passed for {defn?.src?.type}</div>
{/if}

<!-- <div>
  {JSON.stringify(descriptor, null, 2)}
</div> -->
