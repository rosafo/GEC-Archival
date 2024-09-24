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

	async function read(skip?: number, take?: number, defn?: TableFilter) {
		const search = defn?.search;
		let filterOptions = {} as RoleFilterInput;
		if (search) {
			filterOptions = {
				or: [{ notes: { contains: search } }, { name: { contains: search } }]
			};
		}
		return readRoles(skip, take, filterOptions);
	}

	async function deleteContent(params: any) {
		return deleteRole({ id: params });
	}
</script>

<script lang="ts">
	import DataTable, { type TableFilter } from '$cmps/ui/dataTable.svelte';
	import type { ITableColumn } from '$cmps/ui/table.svelte';
	import type { RoleFilterInput } from '$houdini';
	import { createRole, deleteRole, readRoles, updateRole } from '$svc/admin';
	import Editor from './editor.svelte';
</script>

<DataTable
	{read}
	createEntry={createRole}
	updateEntry={updateRole}
	deleteEntry={deleteContent}
	tableColumns={columns}
	editorComponent={Editor}
	sideModalSize="md"
	addButtonLabel="Add New Role"
	addNewHeading="Add New Role"
	updateHeading="Updated Role"
	showActions
	showModalButtons
	allowLoadAfterCreate
	showDelete
	showEdit
/>
