<script lang="ts" context="module">
	function removeIds(components: IComponent[]): IComponent[] {
		return components.map((component) => {
			// Create a shallow copy of the component without the id property
			const { id, ...componentWithoutId } = component;

			// If the component has children, recursively remove their ids as well
			if (componentWithoutId.children && componentWithoutId.children.length > 0) {
				componentWithoutId.children = removeIds(componentWithoutId.children);
			}

			return componentWithoutId;
		});
	}
</script>

<script lang="ts">
	import FileUpload from '$cmps/forms/fileUpload.svelte';

	import Form from '$cmps/forms/form.svelte';
	import TextAreaField from '$cmps/forms/textAreaField.svelte';
	import TextField from '$cmps/forms/textField.svelte';

	import Button from '$cmps/ui/button.svelte';
	import { showError } from '$lib/utils';

	import { Modal } from 'flowbite-svelte';

	import { createEventDispatcher, onMount } from 'svelte';

	import * as z from 'zod';
	import type { IComponent, IParsedComponent, IReportParamTypes } from '../../cai/types';
	import FormBuilder from '../../cai/editor/formBuilder.svelte';
	import PageLoader from '$cmps/ui/pageLoader.svelte';
	import { getReport, getReportParamsFromUpload } from '$svc/admin';

	export let isValid = false;
	export let isReadOnly = false;
	export let recordId = 0;
	export const submit = () => {
		form.submit();
		return true;
	};
	let form: any;
	let isLoading = true;
	let showEditor = false;
	let fileResult: { name: string; type: IReportParamTypes }[] = [];
	const schema = z.object({
		name: z.string().min(1, 'Required'),
		folder: z.string().min(1, 'Required'),
		filterFormDefinition: z.string(),
		description: z.string().optional(),
		reportFile: z.lazy(() => {
			return recordId ? z.union([z.instanceof(File), z.null()]) : z.instanceof(File);
		})
	});

	const dispatch = createEventDispatcher();
	let formData = {
		name: '',
		filterFormDefinition: '',
		folder: '',
		description: '',
		reportFile: null
	};
	let formDefinition: IParsedComponent | null = null;
	let renderId = 0;
	let renderDefinition = 0;

	function handleChange({ detail }: any) {
		const { form, data } = detail;

		data.subscribe((val: any) => {
			formData = val;
		});
		dispatch('changed', formData);

		form.isValid.subscribe((val: boolean) => {
			if (recordId) {
				isValid = true;
			} else {
				isValid = val;
			}
		});
	}

	async function handleFileChange({ detail }: CustomEvent) {
		if (!detail) {
			// formData = {
			// 	...formData,
			// 	filterFormDefinition: ''
			// };
			renderDefinition++;
			return true;
		}
		const { value } = detail;
		if (!value) {
			return true;
		}
		if (formDefinition) return true;
		try {
			const ret = await getReportParamsFromUpload({ reportFile: value });
			if (!ret.success) {
				showError(ret.message);
				return;
			}
			const { data } = ret;
			const result = data.result;
			if (result) {
				fileResult = result;
				if (result.length > 0) showEditor = true;
			}
		} catch (error: any) {
			showError(error?.message || error);
		}
	}

	function onParsedForm({ detail }: CustomEvent) {
		formDefinition = detail;
	}

	function handleValuesClicked() {
		if (formDefinition?.src.children?.length) {
			const d = removeIds(formDefinition?.src.children as IComponent[]);
			formData = {
				...formData,
				filterFormDefinition: JSON.stringify(d)
			};
			renderId++;
			showEditor = false;
		}
	}

	onMount(async () => {
		if (recordId) {
			try {
				const res = await getReport(recordId);

				if (res.success) {
					const { data } = res;
					formData = {
						name: data.name,
						filterFormDefinition: data.formDefinition,
						description: data.description,
						folder: data.category,
						reportFile: null
					};
				} else {
					showError(res.message);
				}
			} catch (err: any) {
				// console.log(err);
				showError(err.message || 'Failed to load data');
			} finally {
				isLoading = false;
			}
		} else {
			isLoading = false;
		}
	});
</script>

{#if isLoading}
	<div class="w-full h-full"><PageLoader size={50} /></div>
{:else}
	{#key renderId}
		<Form
			class="space-y-4 p-4"
			{schema}
			on:change={handleChange}
			initialValues={formData}
			on:submit
			bind:this={form}
		>
			<TextField
				label="Name"
				placeholder="Enter name of report"
				required
				name="name"
				readonly={isReadOnly}
			/>
			<TextField
				label="Category"
				placeholder="Enter report's category"
				required
				name="folder"
				readonly={isReadOnly}
			/>
			<FileUpload
				label="Report File"
				name="reportFile"
				required={recordId ? false : true}
				acceptedFileTypes={['.frx']}
				on:change={handleFileChange}
			/>
			{#key renderDefinition}
				<div class:hidden={true || !(fileResult.length || formData.filterFormDefinition)}>
					<TextAreaField
						label="Definition"
						name="filterFormDefinition"
						readonly={isReadOnly}
						rows={11}
						required
					/>
				</div>
			{/key}
			<div class="flex justify-start" class:hidden={!formData.filterFormDefinition}>
				<Button
					on:click={() => (showEditor = true)}
					type="button"
					label={isReadOnly ? 'Preview Filter Form' : 'Manage Filter Form'}
					color="ghost"
				/>
			</div>
			<TextField label="Description" name="description" readonly={isReadOnly} />
		</Form>
	{/key}
{/if}

<Modal bind:open={showEditor} size="2xl">
	<div class="w-full h-[700px] pt-4 flex flex-col gap-3">
		<FormBuilder
			data={fileResult}
			readonly={isReadOnly}
			on:parsedForm={onParsedForm}
			formData={formData.filterFormDefinition}
		/>
		<div class="flex justify-end" class:hidden={isReadOnly}>
			<Button label="Use Values" color="primary" on:click={handleValuesClicked} />
		</div>
	</div>
</Modal>
