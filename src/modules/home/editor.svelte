<script lang="ts">
	import DateField from '$cmps/forms/dateField.svelte';
	import Form from '$cmps/forms/form.svelte';
	import SelectField from '$cmps/forms/selectField.svelte';
	import TextField from '$cmps/forms/textField.svelte';
	import Button from '$cmps/ui/button.svelte';
	import { showError, showInfo } from '$lib/utils';
	import { createElection } from '$svc/elections';
	// import { userInfo } from '$svc/auth';
	import { createEventDispatcher } from 'svelte';
	import * as z from 'zod';
	const schema = z.object({
		name: z.string().min(1, 'Required'),
		month: z.number({ invalid_type_error: 'Required', required_error: 'Required' }),
		year: z.number({ invalid_type_error: 'Required', required_error: 'Required' })
	});
	let busy = false;
	const dispatch = createEventDispatcher();
	async function handleSubmit({ detail }: CustomEvent) {
		try {
			busy = true;
			const { values } = detail;
			const ret = await createElection({ ...values });
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

<Form {schema} on:submit={handleSubmit} class="flex flex-col gap-6">
	<TextField label="Name" name="name" required />
	<SelectField
		label="Month"
		name="month"
		required
		options={[
			{ value: 1, label: 'January' },
			{ value: 2, label: 'February' },
			{ value: 3, label: 'March' },
			{ value: 4, label: 'April' },
			{ value: 5, label: 'May' },
			{ value: 6, label: 'June' },
			{ value: 7, label: 'July' },
			{ value: 8, label: 'August' },
			{ value: 9, label: 'September' },
			{ value: 10, label: 'October' },
			{ value: 11, label: 'November' },
			{ value: 12, label: 'December' }
		]}
	/>
	<TextField label="Year" name="year" type="number" required />
	<!-- <DateField label="Month" name="month"/> -->
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
