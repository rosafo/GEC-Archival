<script lang="ts">
	import DateField from '$cmps/forms/dateField.svelte';
	import Form from '$cmps/forms/form.svelte';
	import SelectField from '$cmps/forms/selectField.svelte';
	import TextField from '$cmps/forms/textField.svelte';
	import Button from '$cmps/ui/button.svelte';
	import { showError, showInfo } from '$lib/utils';
	import { createElection } from '$svc/elections';
	import dayjs from 'dayjs';
	// import { userInfo } from '$svc/auth';
	import { createEventDispatcher } from 'svelte';
	import * as z from 'zod';
	const schema = z.object({
		name: z.string().min(1, 'Required'),
		startDate: z.string().min(1, 'Required'),
		endDate: z.string().min(1, 'Required'),
		electionType: z.string().min(1, 'Required')
	});
	let busy = false;
	let formData = {
		name: '',
		startDate: null,
		endDate: null,
		electionType: ''
	};
	const dispatch = createEventDispatcher();
	async function handleSubmit({ detail }: CustomEvent) {
		try {
			busy = true;
			const { values } = detail;
			const ret = await createElection({
				...values,
				startDate: new Date(values.startDate),
				endDate: new Date(values.endDate)
			});
			if (!ret.success) {
				showError(ret.message);
				return;
			}
			showInfo(ret.message);
			dispatch('close');
		} catch (error: any) {
			showError(error?.message || error);
		} finally {
			busy = false;
		}
	}
</script>

<Form {schema} initialValues={formData} on:submit={handleSubmit} class="flex flex-col gap-6">
	<TextField label="Name" name="name" required />
	<DateField label="Start Date" name="startDate" required />
	<DateField label="End Date" name="endDate" required />
	<SelectField
		label="Election Type"
		name="electionType"
		options={[
			{ value: 'NATIONAL_ELECTION', label: 'National Election' },
			{ value: 'BY_ELECTION', label: 'By Election' }
		]}
		required
	/>
	<div class="flex justify-end w-fit">
		<Button
			label="Submit"
			type="submit"
			otherClasses="bg-primary-500 text-white border-none hover:bg-primary-600"
			{busy}
		/>
	</div>
	<div class="h-20" />
</Form>
