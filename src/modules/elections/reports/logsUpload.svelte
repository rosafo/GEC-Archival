<script lang="ts">
	import FileUpload from '$cmps/forms/fileUpload.svelte';
	import Form from '$cmps/forms/form.svelte';
	import Button from '$cmps/ui/button.svelte';
	import { showError, showInfo } from '$lib/utils';
	import { uploadFile } from '$svc/elections';

	import * as z from 'zod';

	const schema = z.object({ file: z.instanceof(File) });
	let initialValues: { file?: File } = {
		file: undefined
	}

	let formConfig
	let busy = false;
	const acceptedFileTypes = ["application/x-sqlite3"];

	const fileValidateTypeDetectType = (source: File, type: string) => new Promise<string>((resolve, reject) => {
    if (source.name.endsWith('.db')) {
      resolve('application/x-sqlite3'); // Custom MIME type for .db files
    } else {
      reject(type);
    }
  })

	async function onFormSubmit(e: any) {
		try {
			busy = true
			const ret = await uploadFile(e.detail.values)
			if (ret.success){
				// todo: reset the form
				showInfo(ret.message)
			} else {
				showError(ret.message)
			}
		}
		catch(e: any) {
			showError(e?.message || e || "Submission failed")
		} finally {
			busy = false
		}
	}
	async function onChange({detail}: any) {
		initialValues = detail.values
	}
	async function onReady(e: any) {
		formConfig = e.detail
	}
</script>

<Form {initialValues} {schema} class="space-y-6" on:submit={onFormSubmit} on:change={onChange} on:ready={onReady}>
	<div class="border-4 rounded-md p-4 border-dotted">
		<FileUpload name="file" {acceptedFileTypes} {fileValidateTypeDetectType}/>
	</div>
	<Button label="Upload" type="submit" {busy} otherClasses="bg-primary-500 text-white border-none hover:bg-primary-600" />
</Form>
