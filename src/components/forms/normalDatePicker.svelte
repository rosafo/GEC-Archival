<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { nanoid } from 'nanoid';
	import Flatpickr from 'svelte-flatpickr';
	import 'flatpickr/dist/flatpickr.css';
	import { cn } from '$lib/utils';

	export let name = '';
	export let label = '';
	export let required = false;
	export let readonly = false;
	export let placeholder = '';
	export let enableTime = false;
	export let noCalendar = false;
	export let dateFormat = enableTime ? 'd-m-Y H:i' : 'd-M-Y';
	export let altFormat = enableTime ? 'd-m-Y H:i' : 'd-M-Y'; // enableTime ? "F j, Y" : "F j, Y H:i" // "Y-m-d H:i" //
	export let altInput = true;
	export let weekNumbers = false;
	export let mode: 'single' | 'multiple' | 'range' = 'single';
	export let otherClasses = '';
	export let minDate: string | Date = '';
	export let maxDate: string | Date = '';
	export let hasError = false;
	export let error = '';
	export let value = '';
	export let disableWeekends = false;

	function getWeekends(date: Date) {
		const day = date.getDay();
		return day === 0 || day === 6;
	}

	let id = nanoid();
	let pickerId = nanoid();
	let fullPickerId = `#${pickerId}`;
	let dispatch = createEventDispatcher();

	// const { touched, errors, data }: any = getContext(key);
	let formattedValue: any;

	const options = {
		disable: disableWeekends ? [getWeekends] : [],
		mode,
		enableTime,
		noCalendar,
		dateFormat,
		altFormat,
		altInput,
		weekNumbers,
		minDate,
		maxDate,
		element: fullPickerId,

		onChange(selectedDates: any, dateStr: any) {
			// console.log('changed', { name, selectedDates, dateStr });
		}
	};

	function handleChange(event: any) {
		const [selectedDates, dateStr] = event.detail;
		// console.log({ selectedDates, dateStr });
	}

	// $: hasError = $touched[name] && $errors[name]?.length;
	// $: error = $errors[name]?.join(', ');

	// todo: how to add additional classes
</script>

<fieldset class="flex flex-col gap-1.5 relative">
	<label for={id} class=" text-gray-600 dark:text-white" class:hidden={!label}>
		{label}
		{#if required}
			<span class="text-red-500 pl-1">*</span>
		{/if}
	</label>

	<Flatpickr
		{options}
		bind:value
		bind:formattedValue
		on:change={handleChange}
		{placeholder}
		{name}
		disabled={readonly}
		class={cn(
			'border border-gray-300 border-solid h-[38.4px] rounded-[5px] w-full placeholder:font-thin cursor-pointer disabled:cursor-default',
			otherClasses
		)}
	/>

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
