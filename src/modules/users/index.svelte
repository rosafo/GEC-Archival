<script lang="ts" context="module">
	export interface IUser {
		firstName: string;
		surname: string;
		otherNames: string;
		username: string;
		status: string;
		role: string;
		roleId: number;
		id: number;
	}
	const columns: ITableColumn[] = [
		{
			header: 'Name',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IUser) => `${row.firstName} ${row.surname} ${row.otherNames || ''}` || ''
		},
		{
			header: 'Username',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IUser) => row.username || ''
		},
		{
			header: 'Role',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IUser) => row.role || ''
		},
		{
			header: 'Status',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IUser) => row.status || ''
		}
	];

	async function read() {
		return readUsers();
	}
</script>

<script lang="ts">
	import DataTable from '$cmps/ui/dataTable.svelte';
	import type { ITableColumn } from '$cmps/ui/table.svelte';
	import {  readUsers } from '$svc/admin';
	import Editor from './editor.svelte';
</script>

<DataTable
	{read}
	tableColumns={columns}
	editorComponent={Editor}
	sideModalSize="md"
	addButtonLabel="Add New User"
	addNewHeading="Add New User"
	updateHeading="Updated User"
/>
