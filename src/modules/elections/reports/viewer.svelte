<script lang="ts">
	import Filter from './filter.svelte';
	import { serverUrl } from '$data/shared';
	import { showError } from '$lib/utils';
	import { prepareReport } from '$svc/admin';

	export let id: number;
	export let icon: string;
	export let description: string;
	export let filterForm: Record<string, any>;
	// export let filterFormData = { documentId: 594 } // todo: pass this to the generated form
	// export let url = "";
	export let title = '';
	export let state = {
		formData: {},
		outputFormat: 'PDF',
		url: ''
	};

	let load = false;
	async function generateReport({ detail }: CustomEvent) {
		try {
			// todo: validate
			const ret = await prepareReport({
				reportId: id,
				userId: 0,
				filter: state.formData,
				outputFormat: state.formData.format
			});
			if (ret.success) {
				state.url = `${serverUrl}${ret.result}`;
			} else {
				showError(ret.message || '');
			}
		} catch (error: any) {
			showError(error.message || error);
		} finally {
			load = false;
		}
	}
	// $: console.log({state})
</script>

<div class="flex flex-col gap-2 pt-1 mb-5 w-full h-full">
	<Filter formDefinition={filterForm} bind:formData={state.formData} on:submit={generateReport} />

	<iframe src={state.url} title="Report" class="w-full h-full" class:hidden={!state.url} />
	<div class="w-full h-full flex justify-center pt-20" class:hidden={state.url}>
		<div class="">
			<img src="/chat1.png" alt="chat pic" class="w-64" />
			<p class="text-3xl font-thin font-sans text-teal-500 text-center">No date range</p>
			<p class="font-thin font-sans text-teal-500 text-center">
				Select a date range from the filters above
			</p>
		</div>
	</div>
</div>
