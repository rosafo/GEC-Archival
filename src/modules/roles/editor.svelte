<script lang="ts">
	import Form from '$cmps/forms/form.svelte';
	import SelectField from '$cmps/forms/selectField.svelte';
	import TextAreaField from '$cmps/forms/textAreaField.svelte';
	import TextField from '$cmps/forms/textField.svelte';
	import { showError } from '$lib/utils';
	import { readPermissions } from '$svc/admin';
	import { onMount } from 'svelte';
	import * as z from 'zod';

	const schema = z.object({
		name: z.string().min(1, 'Required'),
		// permissions: z.string().min(1, 'Required'),
		notes: z.string().optional()
	});

	let formData = {
		name: '',
		notes: '',
		permissions: [],
		reports: []
	};

	let permissions: string[] = [];

	async function handleSubmit({ detail }: CustomEvent) {
		const { values } = detail;
	}

	onMount(async () => {
		try {
			const [permissionsRes] = await Promise.all([readPermissions()]);
			if (permissionsRes.success) {
				permissions = permissionsRes.data;
			}
		} catch (error: any) {
			showError(error?.message || error);
		}
	});
</script>

<Form {schema} initialValues={formData} class="space-y-4 p-4" on:submit={handleSubmit}>
	<TextField label="Name" name="name" required />
	<SelectField label="Permissions" name="permissions" options={permissions} labelAsValue />
	<SelectField label="Report" name="reports" options={[]} />
	<TextAreaField label="Notes" name="notes" />
</Form>
