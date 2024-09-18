<script lang="ts" context="module">
	function formatInput(value: string, type: string | null, pattern: string | null) {
		// console.log("formatting", { value, type, pattern })
		if (!value) return '';
		if (!type) return value;
		switch (type) {
			case 'number':
				const v = +value;
				if (isNaN(v)) return '';
				return v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
			default:
				return value;
		}
	}
</script>

<script lang="ts">
	import { fade } from 'svelte/transition';
	import { getContext, createEventDispatcher } from 'svelte';
	import { nanoid } from 'nanoid';
	import { key } from './form';

	export let label: string = '';
	export let name: string = '';
	export let required: Boolean = false;
	export let placeholder: string = '';
	export let otherClasses = '';
	export let readonly = false;
	export let type: 'text' | 'number' = 'text';
	export let pattern = '';
	// export let value = '';

	const { touched, errors, data, setData }: any = getContext(key);
	let id = nanoid();
	let dispatch = createEventDispatcher();

	function onChange() {
		dispatch('change', { name, value: $data[name] });
	}

	$: hasError = $touched[name] && $errors[name]?.length;
	$: error = $errors[name]?.join(', ');
</script>

<fieldset class="flex flex-col gap-1.5 relative {otherClasses}">
	<abbr class="text-gray-600 dark:text-white">
		{label}
		{#if required}
			<span class="text-red-500 pl-1">*</span>
		{/if}
	</abbr>

	{#if readonly}
		<div class="bg-gray-100 rounded-md border border-gray-300 p-2 min-h-[42px]">
			<span>{formatInput($data[name] || '', type, pattern)}</span>
		</div>
	{:else}
		<input
			class:error={hasError}
			class:success={!readonly && !hasError && $touched[name]}
			class:touched={!readonly && $touched[name]}
			class:readonly
			class="border border-gray-300 shadow-gray-50 rounded-[5px] shadow text-black w-full h-[38.4px] outline-transparent focus:outline-transparent focus:outline-none px-3 placeholder:text-gray-500/80 dark:shadow-transparent disabled:bg-gray-50"
			{placeholder}
			{readonly}
			{id}
			value={$data[name] || ''}
			on:change={onChange}
			{type}
			{name}
			{...$$restProps}
		/>
	{/if}

	{#if hasError}
		<label
			for={id}
			transition:fade
			class="flex items-center gap-1 pt-1 text-sm absolute right-2 top-9 v-error-container"
			class:text-red-600={hasError}
		>
			<span class="hidden backdrop-blur-sm v-error-message">
				{error}
			</span>
			<iconify-icon
				icon="solar:danger-circle-bold-duotone"
				class="cursor-pointer select-none ml-auto v-error-svg text-red-500 hover:text-red-600"
				style="font-size: 18px;"
			/>
		</label>
	{/if}
</fieldset>

<style>
	.v-error-container:hover .v-error-message {
		display: block !important;
	}
	.error {
		@apply border-red-600;
	}
	.success {
		@apply border-green-600;
	}
	.readonly {
		@apply bg-[#f1f1f1];
	}
</style>
