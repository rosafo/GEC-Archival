<script lang="ts">
	import FileUpload from '$cmps/forms/fileUpload.svelte';
	import Form from '$cmps/forms/form.svelte';
	import Button from '$cmps/ui/button.svelte';
	import { showError, showInfo } from '$lib/utils';
	import { uploadLogs } from '$svc/elections';

	import * as z from 'zod';

	const schema = z.object({ upload: z.instanceof(File) });
	let busy = false;

	let initialValues = {
		upload: null
	};
	let renderId = 0;

	async function handleSubmit({ detail }: CustomEvent) {
		const { values } = detail;
		try {
			busy = true;
			const ret = await uploadLogs(values.upload);
			if (!ret?.success) {
				showError(ret?.message || '');
				return;
			}
			showInfo(ret.message);
			initialValues = { upload: null };
			renderId++;
		} catch (error: any) {
			showError(error?.message || error);
		} finally {
			busy = false;
		}
	}
</script>

{#key renderId}
	<Form {schema} class="space-y-6" on:submit={handleSubmit}>
		<div class="border-4 rounded-md p-4 border-dotted">
			<FileUpload name="upload" />
		</div>
		<Button
			label="Upload"
			type="submit"
			{busy}
			otherClasses="bg-primary-500 text-white border-none hover:bg-primary-600"
		/>
	</Form>
{/key}
