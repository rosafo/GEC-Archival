<script lang="ts" context="module">
	export interface IReport {
		id: number;
		name: string;
		description: string;
		formDefinition: string;
		parameters: string;
		active: boolean;
		category: string;
	}

	const columns: ITableColumn[] = [
		{
			header: 'Name',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IReport) => row.name || '-'
		},
		{
			header: 'Description',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IReport) => row.description || '-'
		},
		{
			header: 'Category',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IReport) => row.category || '-'
		},
		{
			header: 'Status',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IReport) => (row.active ? 'ACTIVE' : 'DISABLED')
		}
	];

	async function read() {
		return getAllReports();
	}
</script>

<script lang="ts">
	import DataTable from '$cmps/ui/dataTable.svelte';
	import type { ITableColumn } from '$cmps/ui/table.svelte';
	import { getAllReports, readRoles } from '$svc/admin';
	import Editor from './editor.svelte';
</script>

<DataTable
	{read}
	tableColumns={columns}
	editorComponent={Editor}
	sideModalSize="md"
	addButtonLabel="Add New Report"
	addNewHeading="Add New Report"
	updateHeading="Update Report"
	showActions
	showModalButtons
	allowLoadAfterCreate
	showDelete
	showEdit
/>
