<script lang="ts" context="module">
	export interface IRole {
		name: string;
		permissions: string[];
		id: number;
		notes: string;
	}
	const columns: ITableColumn[] = [
		{
			header: 'Name',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IRole) => row.name || ''
		},
		{
			header: 'Permissions',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IRole) => row.permissions.length || ''
		},
		{
			header: 'Notes',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IRole) => row.notes || ''
		}
	];

	async function read() {
		return readRoles();
	}
</script>

<script lang="ts">
	import DataTable from '$cmps/ui/dataTable.svelte';
	import type { ITableColumn } from '$cmps/ui/table.svelte';
	import { readRoles } from '$svc/admin';
	import Editor from './editor.svelte';
</script>

<DataTable
	{read}
	tableColumns={columns}
	editorComponent={Editor}
	sideModalSize="md"
	addButtonLabel="Add New Role"
	addNewHeading="Add New Role"
	updateHeading="Updated Role"
/>
