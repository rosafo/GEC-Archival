<script lang="ts">
	import Form from '$cmps/forms/form.svelte';
	import SelectField from '$cmps/forms/selectField.svelte';
	import TextAreaField from '$cmps/forms/textAreaField.svelte';
	import TextField from '$cmps/forms/textField.svelte';
	import PageLoader from '$cmps/ui/pageLoader.svelte';
	import { showError } from '$lib/utils';
	import { getAllReports, readPermissions, readRoleById } from '$svc/admin';
	import { readReports } from '$svc/reports';
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
		name: z.string().min(1, 'Required'),
		// permissions: z.string().min(1, 'Required'),
		notes: z.string().optional()
	});

	let formData = {
		name: '',
		notes: '',
		permissions: [] as string[],
		reports: [] as number[],
		dashboards: [] as number[],
		active: true
	};

	let permissions: any[] = [];
	let reports: any[] = [];
	let renderId = 0;
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
			const [permissionsRes, reportsRes] = await Promise.all([
				readPermissions(),
				getAllReports(true, 1, 1000)
			]);
			if (permissionsRes?.success) {
				permissions = permissionsRes.data.map((x) => ({ value: x, label: x }));
			}

			if (reportsRes.success) {
				reports = reportsRes.data.items?.map((x) => ({ value: x.id, label: x.name })) as any[];
			}

			if (recordId) {
				const dataRes = await readRoleById(recordId);
				if (dataRes?.success) {
					formData = {
						name: dataRes.data.name,
						notes: dataRes.data.notes,
						permissions: dataRes.data.permissions as string[],
						reports: dataRes.data.reports as number[],
						active: dataRes.data.active,
						dashboards: dataRes.data.dashboards
					};
				}
			}
		} catch (error: any) {
			showError(error?.message || error);
		} finally {
			busy = false;
		}
	});
</script>

{#if busy}
	<div class="w-full h-full"><PageLoader size={50} /></div>
{:else}
	<Form
		{schema}
		initialValues={formData}
		class="space-y-4 p-4"
		on:submit
		bind:this={form}
		on:change={handleChange}
	>
		<TextField label="Name" name="name" required />
		<SelectField
			label="Permissions"
			name="permissions"
			options={permissions}
			labelAsValue
			readonly={isReadOnly}
			multiple
		/>
		<SelectField label="Report" name="reports" options={reports} readonly={isReadOnly} multiple />
		<TextAreaField label="Notes" name="notes" readonly={isReadOnly} />
	</Form>
{/if}
