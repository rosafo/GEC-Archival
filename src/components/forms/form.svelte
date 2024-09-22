<script lang="ts" context="module">
	// import type { SubmitContext } from "felte/dist/esm/create-form" // not found

	export interface ISubmitContext<T> {}
	export interface ISubmitArgs<T> {
		values: T;
		context: ISubmitContext<T>;
	}
</script>

<script lang="ts">
	import { createForm } from 'felte';
	import { createEventDispatcher, onDestroy, onMount, setContext } from 'svelte';
	import { key } from './form';
	import { validator } from '@felte/validator-zod';

	// Define the required props for the component
	// export let validate: (values: any) => any = (values) => ({});
	export let schema: any;
	export let transform: (values: any) => any = (values) => values;
	export let initialValues: any = {};
	// export let validators: any[] = [];
	// export let otherClasses = '';

	// Create an event dispatcher
	let ready;
	let dispatch = createEventDispatcher();

	// Initialize form and data using the provided props
	const formInfo = createForm({
		onSubmit: (values: any, context: any) => {
			dispatch('submit', { values, context });
		},
		// validate: validate,
		extend: validator({ schema }),
		transform: transform,
		initialValues: initialValues
	});

	// Set the formInfo context
	setContext(key, formInfo);

	// Extract form, data, setData, and setFields from formInfo
	const { form, data, setData, errors, isValid, setFields, handleSubmit } = formInfo;
	const disposeSub = data.subscribe((values: any) => {
		dispatch('change', { values: $data, isValid: $isValid, form: formInfo, data });
	});

	errors.subscribe((o) => {
		for(let key in o) {
			if (o[key]) {
				console.log(o)
				return
			}
		}
	});
	// $: ready && dispatch('change', { values: $data, form: formInfo });

	// Dispatch 'change' and 'ready' events
	onMount(() => {
		// console.log("data", $data)
		// dispatch('change', { values: data, form: formInfo });
		setTimeout(() => dispatch('ready', formInfo), 0);
		// ready = true
	});

	onDestroy(() => {
		disposeSub();
	});
	// Define the updateWith function
	export const updateWith = (newData: any) => {
		// console.log({ updatingWith: newData });
		Object.keys(newData).forEach((k) => {
			setFields(k, newData[k]);
		});
	};

	export const submit = handleSubmit;
</script>

<form use:form {...$$restProps}>
	<slot {initialValues} isValid={$isValid} values={$data} />
</form>
