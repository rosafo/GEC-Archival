<script lang="ts">
	import Form from '$cmps/forms/form.svelte';
	import TextField from '$cmps/forms/textField.svelte';
	import PageLoader from '$cmps/ui/pageLoader.svelte';
	import { showError } from '$lib/utils';
	import { readFileDataById } from '$svc/elections';
	import { onMount } from 'svelte';
	import * as z from 'zod';
	import dayjs from 'dayjs';

	export let recordId = '';
	let busy = true;
	let formData = {};

	const schema = z.object({});

	onMount(async () => {
		try {
			const ret = await readFileDataById(recordId);
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
		<TextField label="Uploaded By" name="uploadBy" readonly />
		<TextField label="Number of successful" name="numberSuccessful" readonly />
		<TextField label="Number of failed" name="numberFailed" readonly />
		<TextField label="Number of manual" name="numberManual" readonly />
		<TextField label="Polling Station" name="pollingStation" readonly />
		<TextField label="Device ID" name="deviceId" readonly />
	</Form>
{/if}
