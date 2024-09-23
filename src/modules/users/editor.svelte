<script lang="ts">
	import Form from '$cmps/forms/form.svelte';
	import SelectField from '$cmps/forms/selectField.svelte';
	import TextField from '$cmps/forms/textField.svelte';
	import { showError } from '$lib/utils';
	import { readRoles } from '$svc/admin';
	import { onMount } from 'svelte';
	import * as z from 'zod';

	const schema = z.object({
		firstName: z.string().min(1, 'Required'),
		surname: z.string().min(1, 'Required'),
		username: z.string().min(1, 'Required'),
		otherNames: z.string().optional(),
		role: z.number({ invalid_type_error: 'Required', required_error: 'Required' })
	});
	let formData = {
		firstName: '',
		surname: '',
		otherNames: '',
		username: '',
		role: ''
	};
	let roles: any[] = [];

	async function handleSubmit({ detail }: CustomEvent) {
		const { values } = detail;
	}

	onMount(async () => {
		try {
			const [rolesRes] = await Promise.all([readRoles()]);
			if (rolesRes.success) {
				roles = rolesRes.data.items;
			}
		} catch (error: any) {
			showError(error?.message || error);
		}
	});
</script>

<Form class="space-y-4 p-4" {schema} initialValues={formData} on:submit={handleSubmit}>
	<TextField label="First Name" name="firstName" required />
	<TextField label="Surname" name="surname" required />
	<TextField label="Other Name(s)" name="otherNames" />
	<TextField label="Username" name="username" required />
	<SelectField label="Role" name="role" required />
</Form>
