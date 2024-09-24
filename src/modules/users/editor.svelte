<script lang="ts">
	import Form from '$cmps/forms/form.svelte';
	import SelectField from '$cmps/forms/selectField.svelte';
	import TextField from '$cmps/forms/textField.svelte';
	import PageLoader from '$cmps/ui/pageLoader.svelte';
	import { showError } from '$lib/utils';
	import { getUserById, readRoles } from '$svc/admin';
	import { onMount } from 'svelte';
	import * as z from 'zod';

	export let isValid = false;
	export let isReadOnly = false;
	export let recordId = 0;
	export const submit = () => {
		form.submit();
		return true;
	};
	let form: any;

	const schema = z.object({
		firstName: z.string().min(1, 'Required'),
		lastName: z.string().min(1, 'Required'),
		username: z.string().min(1, 'Required'),
		otherNames: z.string().optional(),
		email: z.string().email(),
		roleId: z.number({ invalid_type_error: 'Required', required_error: 'Required' })
	});
	let formData = {
		active: true,
		email: '',
		firstName: '',
		lastName: '',
		otherNames: '',
		username: '',
		roleId: null,
		tags: []
	};
	let roles: any[] = [];
	let busy = true;

	function handleChange({ detail }: any) {
		const { form, data } = detail;

		form.isValid.subscribe((val: boolean) => {
			if (recordId) {
				isValid = true;
			} else {
				isValid = val;
			}
		});
	}

	onMount(async () => {
		try {
			const [rolesRes] = await Promise.all([readRoles(1, 1000)]);
			if (rolesRes.success) {
				roles = rolesRes.data.items?.map((x) => ({ value: x.id, label: x.name })) as any[];
			}

			if (recordId) {
				const dataRes = await getUserById(recordId);
				if (dataRes?.success) {
					formData = {
						active: dataRes.data.active,
						email: dataRes.data.email,
						firstName: dataRes.data.firstName,
						lastName: dataRes.data.surname,
						otherNames: dataRes.data.otherNames,
						username: dataRes.data.username,
						roleId: dataRes.data.roleId,
						tags: []
					};
				}
			}
		} catch (error: any) {
			showError(error?.message || error);
		}finally{
			busy = false
		}
	});
</script>

{#if busy}
	<div class="w-full h-full"><PageLoader size={50} /></div>
{:else}
	<Form
		class="space-y-4 p-4"
		{schema}
		initialValues={formData}
		on:submit
		bind:this={form}
		on:change={handleChange}
	>
		<TextField label="First Name" name="firstName" required readonly={isReadOnly} />
		<TextField label="Surname" name="lastName" required readonly={isReadOnly} />
		<TextField label="Other Name(s)" name="otherNames" readonly={isReadOnly} />
		<TextField label="Username" name="username" required readonly={isReadOnly} />
		<TextField label="Email" name="email" required readonly={isReadOnly} />
		<SelectField label="Role" name="roleId" required readonly={isReadOnly} options={roles} />
	</Form>
{/if}
