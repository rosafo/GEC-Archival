<script lang="ts">
	import Form from '$cmps/forms/form.svelte';
	import ComponentRenderer from '$cai/ComponentRenderer.svelte';
	import type { IParsedComponent } from '$cai/types';
	import { createEventDispatcher } from 'svelte';
	import type { Emitter } from 'mitt';
	import * as z from 'zod';

	export let contextKey: symbol;
	export let children: IParsedComponent[] = [];
	export let classes = '';
	export let state = {};
	export let name = '';
	export let emitter: Emitter<any> | null;

	const schema = z.object({});

	const dispatch = createEventDispatcher();
	// todo: get existing values
	function onChange({ detail }: any) {
		// console.log("onChanged", detail.formValues, { detail })
		// dispatch("change", { name, value: detail.formValues, isValid: detail.isValid })
		emitter?.emit('change', {
			src: 'form',
			name,
			value: detail.formValues,
			isValid: detail.isValid
		});
	}
</script>

<Form {schema} {contextKey} initialValues={state} on:submit class={classes} on:change={onChange}>
	{#each children || [] as child}
		<ComponentRenderer defn={child} {contextKey} {emitter} />
	{/each}
</Form>
