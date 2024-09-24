<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { IComponent, IParsedComponent } from '$cai/types';
	import { parseComponent } from '$cai/ComponentStore.svelte';
	import ComponentRenderer from '$cai/ComponentRenderer.svelte';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import { showError } from '$lib/utils';

	export let formDefinition: IComponent;
	export let formData = { format: 'PDF' };

	let dispatch = createEventDispatcher();
	let isValid = true;
	let parsedForm: IParsedComponent;
	$: {
		const defn: IComponent = {
			type: 'form',
			props: { classes: 'border-green-200 border bg-green-50 p-2' },
			children: [
				formDefinition,
				{
					type: 'hstack',
					props: { classes: 'mt-3 gap-2' },
					children: [
						{
							type: 'select',
							props: { name: 'format', label: '', labelAsValue: true, options: ['PDF'] }
						},
						{
							type: 'button',
							props: {
								label: 'Generate Report',
								cmd: { msg: 'submit', args: { hint: 'Report Generation' } }
							}
						}
					]
				}
			]
		};
		parsedForm = parseComponent(defn);
	}

	function formChanged({ detail }: any) {
		formData = detail.value;
		isValid = detail.isValid;
	}
	function generate() {
		if (!formData) {
			showError('Please fill the form before generating the report.');
			return;
		}
		if (!formData.format) {
			showError('The output format is required');
			return;
		}
		// todo: validate
		// todo: convert a number
		// formData = {
		// 	format: "PDF",
		// 	from: null, to: null,
		// 	loanType: null, status: null, staffNumber: null
		// }
		const dataWithoutNulls = Object.fromEntries(
			Object.entries(formData).filter(([key, value]) => value !== null && value !== '')
		);
		// console.log("data", {formData, dataWithoutNulls})
		formData = dataWithoutNulls;
		dispatch('submit', { value: dataWithoutNulls, isValid });
	}
</script>

<Accordion flush>
	<AccordionItem open class="hover:bg-gray-200 px-4 py-2">
		<span slot="header" class="flex items-center gap-2">
			<iconify-icon icon="mdi:report-bar" />
			Report Filter</span
		>
		{#if parsedForm}
			<ComponentRenderer
				defn={parsedForm}
				on:change={formChanged}
				on:submit={generate}
				state={formData}
			/>
		{/if}
	</AccordionItem>
</Accordion>
