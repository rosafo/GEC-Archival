<script lang="ts" context="module">
	import dayjs from 'dayjs';

	export interface IBrowseData {
		date: Date;
		voterId: string;
		verificationType: string;
		status: string;
		notes: string;
		pollingStationCode: string;
		id: string;
		gender: string;
	}
	const columns: ITableColumn[] = [
		{
			header: 'Date',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IBrowseData) => dayjs(row.date).format('DD-MMM-YYYY') || ''
		},
		{
			header: 'Voter ID',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IBrowseData) => row.voterId || ''
		},
		{
			header: 'Gender',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IBrowseData) => row.gender || ''
		},
		{
			header: 'Verification Type',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IBrowseData) => row.verificationType || '-'
		},
		{
			header: 'Status',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IBrowseData) => row.status || ''
		},
		{
			header: 'Polling Station Code',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IBrowseData) => row.pollingStationCode || ''
		},
		{
			header: 'Notes',
			plugins: {
				sort: { disable: true }
			},
			accessor: (row: IBrowseData) => row.notes || ''
		}
	];
	async function read(skip?: number, take?: number, defn?: TableFilter) {
		// const filterValues = defn?.filter as IBrowseFilterValues;
		// const search = defn?.search;
		// let filterOptions = {} as any;
		// console.log(search, filterValues);

		const filterValues = defn?.filter as IBrowseFilterValues;
		const search = defn?.search;
		let filterOptions = {} as VerificationEntryFilterInput;
		if (search) {
			filterOptions = {
				or: [
					{ gender: { contains: search } },
					{ pollingStationCode: { contains: search } },
					{ status: { contains: search } },
					{ notes: { contains: search } },
					{ voterId: { contains: search } }

					// { verificationType: { eq: search as VerificationType$options } }
				]
			};
		}
		if (filterValues && filterValues.voterId) {
			filterOptions = {
				...filterOptions,
				voterId: { contains: filterValues.voterId }
			};
		}
		if (filterValues && filterValues.verificationType) {
			filterOptions = {
				...filterOptions,
				verificationType: { eq: filterValues.verificationType as VerificationType$options }
			};
		}
		if (filterValues && filterValues.gender) {
			filterOptions = {
				...filterOptions,
				gender: { contains: filterValues.gender }
			};
		}
		if (filterValues && filterValues.pollingStationCode) {
			filterOptions = {
				...filterOptions,
				pollingStationCode: { contains: filterValues.pollingStationCode }
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
		return readBrowseData(skip, take, filterOptions);
	}
</script>

<script lang="ts">
	import DataTable, { type TableFilter } from '$cmps/ui/dataTable.svelte';
	import type { ITableColumn } from '$cmps/ui/table.svelte';
	import { readBrowseData } from '$svc/elections';
	import Editor from './editor.svelte';
	import FilterOptions, { type IBrowseFilterValues } from './filterOptions.svelte';
	import type { VerificationEntryFilterInput, VerificationType$options } from '$houdini';

	let functionToRun = read;
	let reloadData = 0;
	let query = '';
	let formData: any = {};
	let filters = {
		statuses: ['Successful', 'Failed'],
		verificationTypes: ['FACE', 'FINGER', 'MANUAL'],
		// pollingStations: [] as any[],
		gender: ['Male', 'Female']
	};

	function handleFilter(
		filterValues: IBrowseFilterValues,
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

	// onMount(async () => {
	// 	try {
	// 		const ret = await readPollingStations();
	// 		if (ret.success) {
	// 			filters = { ...filters, pollingStations: ret.data };
	// 		} else {
	// 			showError(ret.message || 'failed to load polling stations');
	// 		}
	// 	} catch (error: any) {
	// 		showError(error?.message || error);
	// 	}
	// });
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
