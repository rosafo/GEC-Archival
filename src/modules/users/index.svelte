<script lang="ts" context="module">
	export interface IUser {
		activeDashboardId: number;
		firstName: string;
		surname: string;
		tags: string[];
		type: UserType$options;
		otherNames: string;
		username: string;
		active: boolean;
		email: string;
		role: { name: string; id: number };
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
			header: 'Email',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IUser) => row.email || ''
		},
		{
			header: 'Role',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IUser) => row.role.name || ''
		},
		{
			header: 'Status',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IUser) => (row.active ? 'ACTIVE' : 'INACTIVE')
		}
	];

	async function read(skip?: number, take?: number, defn?: TableFilter) {
		const search = defn?.search;
		let filterOptions = {} as UserFilterInput;
		if (search) {
			filterOptions = {
				or: [
					{ firstName: { contains: search } },
					{ surname: { contains: search } },
					{ otherNames: { contains: search } },
					{ email: { contains: search } },
					{ username: { contains: search } }
				]
			};
		}
		return readUsers(skip, take, filterOptions);
	}
</script>

<script lang="ts">
	import DataTable, { type TableFilter } from '$cmps/ui/dataTable.svelte';
	import type { ITableColumn } from '$cmps/ui/table.svelte';
	import type { UserFilterInput, UserType$options } from '$houdini';
	import { createUser, deleteUser, readUsers, updateUser } from '$svc/admin';
	import Editor from './editor.svelte';
</script>

<DataTable
	{read}
	createEntry={createUser}
	updateEntry={updateUser}
	deleteEntry={deleteUser}
	tableColumns={columns}
	editorComponent={Editor}
	sideModalSize="md"
	addButtonLabel="Add New User"
	addNewHeading="Add New User"
	updateHeading="Update User"
	showActions
	showModalButtons
	allowLoadAfterCreate
	showDelete
	showEdit
/>
