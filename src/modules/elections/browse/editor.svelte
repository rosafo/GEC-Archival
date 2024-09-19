<script lang="ts">
	import Form from '$cmps/forms/form.svelte';
	import TextField from '$cmps/forms/textField.svelte';
	import PageLoader from '$cmps/ui/pageLoader.svelte';
	import { showError } from '$lib/utils';
	import { readBrowseDataById } from '$svc/elections';
	import { onMount } from 'svelte';
	import * as z from 'zod';
	import dayjs from 'dayjs';
	import TextAreaField from '$cmps/forms/textAreaField.svelte';

	export let recordId = '';
	let busy = true;
	let formData = {};

	const schema = z.object({});

	onMount(async () => {
		try {
			const ret = await readBrowseDataById(recordId);
			if (!ret.success) {
				showError(ret.message);
				return;
			}
			formData = { ...ret.data, date: dayjs(ret.data.date).format('DD-MM-YYYY') };
		} catch (error: any) {
			showError(error?.message || error);
		} finally {
			busy = false;
		}
	});
</script>

{#if busy}
	<div>
		<PageLoader size={50} />
	</div>
{:else}
	<Form {schema} class="p-4 space-y-5" initialValues={formData}>
		<TextField label="Date" name="date" readonly />
		<TextField label="Voter ID" name="voterId" readonly />
		<TextField label="Verification Type" name="verificationType" readonly />
		<TextField label="Status" name="status" readonly />
		<TextField label="Polling Station" name="pollingStation" readonly />
		<TextAreaField label="Notes" name="notes" readonly />
	</Form>
{/if}
