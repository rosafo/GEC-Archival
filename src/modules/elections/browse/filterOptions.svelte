<script lang="ts" context="module">
	export interface IBrowseFilterValues {
		status: string;
		dateRange: string;
		voterId: string;
		verificationType: string;
		pollingStation: string;
		gender: string;
	}
</script>

<script lang="ts">
	import DateField from '$cmps/forms/dateField.svelte';

	import Form from '$cmps/forms/form.svelte';
	import SelectField from '$cmps/forms/selectField.svelte';
	import TextField from '$cmps/forms/textField.svelte';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import { scale } from 'svelte/transition';
	import * as z from 'zod';
	const dispatch = createEventDispatcher();

	export let filters: any = {};
	export let open = false;
	export let filterValues = {
		status: '',
		dateRange: '',
		voterId: '',
		verificationType: '',
		pollingStation: '',
		gender: ''
	};

	const schema = z.object({});

	function handleChange(value: string, name: string) {
		filterValues = { ...filterValues, [name]: value };
		dispatch('filter', filterValues);
	}
</script>

<Accordion flush>
	<AccordionItem bind:open class="hover:bg-gray-200 px-4 py-2" transitionType={'fade'}>
		<span slot="header" class="flex items-center gap-2">
			<iconify-icon icon="mdi:report-bar" />
			Advanced Search</span
		>
		<Form initialValues={filterValues} {schema} class="flex flex-col gap-4 w-full">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<DateField
					label="Date Range"
					name="dateRange"
					mode="range"
					on:change={({ detail }) => {
						const { dateStr } = detail;
						handleChange(detail ? dateStr : '', 'dateRange');
					}}
				/>
				<SelectField
					label="Status"
					name="status"
					options={filters.statuses}
					labelAsValue
					on:change={({ detail }) => handleChange(detail ? detail.label : '', 'status')}
				/>
				<TextField
					label="Voter ID"
					name="voterId"
					on:change={({ detail }) => {
						// console.log(detail);
						const { value } = detail;
						handleChange(detail ? value : '', 'voterId');
					}}
				/>

				<SelectField
					label="Verification Type"
					name="verificationType"
					options={filters.verificationTypes}
					labelAsValue
					on:change={({ detail }) => handleChange(detail ? detail.label : '', 'verificationType')}
				/>
				<SelectField
					label="Polling Stations"
					name="pollingStation"
					options={filters.pollingStations}
					on:change={({ detail }) => {
						if (detail !== null) {
							handleChange(detail.label, 'pollingStation');
						} else {
							handleChange('', 'pollingStation');
						}
					}}
					labelAsValue
				/>
				<SelectField
					label="Gender"
					name="gender"
					options={filters.gender}
					labelAsValue
					on:change={({ detail }) => handleChange(detail ? detail.label : '', 'gender')}
				/>
			</div>
		</Form>
	</AccordionItem>
</Accordion>
