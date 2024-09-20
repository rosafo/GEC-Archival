<!-- <script lang="ts">
	import FileUpload from '$cmps/forms/fileUpload.svelte';
	import Form from '$cmps/forms/form.svelte';
	import Button from '$cmps/ui/button.svelte';

	import * as z from 'zod';

	const schema = z.object({ upload: z.instanceof(File) });
	let busy = false;
</script>

<Form {schema} class="space-y-6">
	<div class="border-4 rounded-md p-4 border-dotted">
		<FileUpload name="upload" />
	</div>
	<Button label="Upload" type="submit" {busy} otherClasses="bg-primary-500 text-white border-none hover:bg-primary-600" />
</Form> -->
