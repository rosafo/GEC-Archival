<script lang="ts" context="module">
	import dayjs from 'dayjs';

	export interface IFilesData {
		date: Date;
		deviceId: string;
		electionId: number;
		fileHash: string;
		id: number;
		invalidVoterCount: number;
		notes: string;
		numberFailed: number;
		numberManual: number;
		numberSuccessful: number;
		pollingStationCode: string;
		processTime: number;
		status: '';
		voterCount: VerificationFileStatus$options;
		uploadeBy: string;
	}
	const columns: ITableColumn[] = [
		{
			header: 'Date',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IFilesData) => dayjs(row.date).format('DD-MMM-YYYY') || ''
		},
		{
			header: 'Upload By',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IFilesData) => row.uploadeBy || ''
		},
		{
			header: 'Polling Station Code',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IFilesData) => row.pollingStationCode || ''
		},
		{
			header: 'No. of Success',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IFilesData) => row.numberSuccessful || '-'
		},
		{
			header: 'No. of Manual',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IFilesData) => row.numberManual || ''
		},
		{
			header: 'No. of Failure',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IFilesData) => row.numberFailed || ''
		},
		{
			header: 'Device ID',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IFilesData) => row.deviceId || ''
		}
	];
	async function read(skip?: number, take?: number, defn?: TableFilter) {
		const filterValues = defn?.filter as IFileFilterValues;
		const search = defn?.search;
		let filterOptions = {} as VerificationFileFilterInput;
		// console.log(search, filterValues);
		if (search) {
			filterOptions = {
				or: [
					{ deviceId: { contains: search } },
					{ pollingStationCode: { contains: search } },
					{ uploadeBy: { contains: search } }
				]
			};
		}
		if (filterValues && filterValues.deviceId) {
			filterOptions = {
				...filterOptions,
				deviceId: { contains: filterValues.deviceId }
			};
		}
		if (filterValues && filterValues.uploadedBy) {
			filterOptions = {
				...filterOptions,
				uploadeBy: { contains: filterValues.uploadedBy }
			};
		}
		if (filterValues && filterValues.dateRange) {
			const dates = filterValues.dateRange.split(' to ');
			const startDate = new Date(dates[0]);
			const endDate = dayjs(dates.length > 1 ? dates[1] : dates[0])
				.add(1, 'day')
				.toDate();
			filterOptions = { ...filterOptions, createdOn: { gte: startDate, lt: endDate } };
		}
		return readFilesData(skip, take, filterOptions);
	}
</script>

<script lang="ts">
	import DataTable, { type TableFilter } from '$cmps/ui/dataTable.svelte';
	import type { ITableColumn } from '$cmps/ui/table.svelte';
	import { showError } from '$lib/utils';
	import { onMount } from 'svelte';
	import { readFilesData, readPollingStations, readUploadUsers } from '$svc/elections';
	import Editor from './editor.svelte';
	import FilterOptions, { type IFileFilterValues } from './filterOptions.svelte';
	import type { VerificationFileFilterInput, VerificationFileStatus$options } from '$houdini';

	let functionToRun = read;
	let reloadData = 0;
	let query = '';
	let formData: any = {};
	let filters = {
		pollingStations: [] as any[],
		users: [] as any[]
	};

	function handleFilter(
		filterValues: IFileFilterValues,
		pageSize: number,
		currentPage: number,
		search: string
	) {
		functionToRun = () =>
			read(currentPage, pageSize, {
				filter: filterValues
			});
		reloadData++;
	}

	onMount(async () => {
		try {
			const [stationsRes, usersRes] = await Promise.all([readPollingStations(), readUploadUsers()]);
			if (stationsRes.success) {
				filters = { ...filters, pollingStations: stationsRes.data };
			} else {
				showError(stationsRes.message || 'failed to load polling stations');
			}
			if (usersRes.success) {
				filters = { ...filters, users: usersRes.data };
			} else {
				showError(usersRes.message || 'failed to load users');
			}
		} catch (error: any) {
			showError(error?.message || error);
		}
	});
</script>

<div class="flex-grow h-full w-full bg-white loginbox rounded-t-[5px] overflow-y-hidden">
	<DataTable
		fillSpace={true}
		bgWhite
		read={functionToRun}
		tableColumns={columns}
		editorComponent={Editor}
		showAdd={false}
		rowClickable
		bind:reloadData
		allowSticky={false}
		on:rowClicked
		bind:query
		customFilterValues={formData}
		showInLineRowClickData
		addNewHeading="View Details"
		sideModalSize="md"
	>
		<div slot="tableFilters" let:pageSize let:currentPage let:search class="px-4">
			<FilterOptions
				{filters}
				bind:filterValues={formData}
				on:filter={({ detail }) => handleFilter(detail, pageSize, currentPage, search)}
			/>
		</div>
	</DataTable>
</div>
