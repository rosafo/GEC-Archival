import {
	CreateElectionStore,
	ReadElectionsStore,
	ReadElectionSummaryStore,
	ReadGenderVerficationsStore,
	VerificationEntriesStore,
	type ElectionFilterInput,
	type ElectionSortInput,
	type ElectionType$options,
	type VerificationEntryFilterInput,
	type VerificationEntrySortInput
} from '$houdini';
import type { ICallResultType, IQuerryResultType, ITableDataProps } from '$lib/types';
import type { IBrowseData } from '$modules/elections/browse/index.svelte';
import type { IElectionDashoardTypes } from '$modules/elections/dashboard.svelte';
import type { IFilesData } from '$modules/elections/files/index.svelte';
import type { IElectionToPlot } from '$modules/home/index.svelte';
import { callResult, getOne, getPageInfo, gqlError, queryResult } from '$svc/shared';
import { nanoid } from 'nanoid';

export interface IElectionDto {
	name: string;
	startDate: Date;
	endDate: Date;
	electionType: 'BY_ELECTION' | 'NATIONAL_ELECTION';
}

export interface IElection extends IElectionDto {
	id: number;
}

const data: IElection[] = [
	{
		name: '2000 Election',
		year: 2000,
		month: 12,
		id: '1'
	},
	{
		name: '2004 Election',
		year: 2004,
		month: 12,

		id: '2'
	},
	{
		name: '2008 Election',
		year: 2008,
		month: 12,

		id: '3'
	},
	{
		name: '2012 Election',
		year: 2012,
		month: 12,

		id: '4'
	},
	{
		name: '2016 Election',
		year: 2016,
		month: 12,

		id: '5'
	},
	{
		name: '2020 Election',
		year: 2020,
		month: 12,

		id: '6'
	},
	{
		name: '2024 Election',
		year: 2024,
		month: 12,

		id: '7'
	}
];
export async function readElections(
	page: number = 1,
	pageSize: number = 10,
	filter: ElectionFilterInput = {},
	order: ElectionSortInput[] = [{ startDate: 'DESC' }]
) {
	try {
		const ret = await new ReadElectionsStore().fetch({
			variables: { ...getPageInfo(page, pageSize), filter: filter, order }
		});
		return queryResult(ret, ret.data?.elections);
	} catch (e) {
		return gqlError(e);
	}
}

export async function createElection(params: IElectionDto) {
	try {
		const ret = await new CreateElectionStore().mutate({ input: params });
		return callResult(ret, ret.data?.createElection);
	} catch (error) {
		return gqlError(error);
	}
}

export async function readElectionGraph() {
	try {
		const ret = await new ReadGenderVerficationsStore().fetch();
		return queryResult(ret, ret.data?.verificationsByGender);
	} catch (error) {
		gqlError(error);
	}
}

export async function readElectionDashboard(id: string) {
	try {
		const ret = await new ReadElectionSummaryStore().fetch({ variables: { id: +id } });
		return queryResult(ret, ret.data?.electionSummary);
	} catch (error) {
		gqlError(error);
	}
}

export async function readElectionById(id: string) {
	try {
		const ret = await readElections(1, 1, { id: { eq: +id } });
		return getOne(ret, (x) => x!.items);
	} catch (error) {
		gqlError(error);
	}
}

function randomDate(start: Date, end: Date): Date {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const statuses = ['Verified', 'Pending', 'Rejected', 'In Progress'];
const verificationTypes = ['Biometric', 'ID Card', 'Manual'];
const pollingStations = ['Station 1', 'Station 2', 'Station 3', 'Station 4'];

export async function readBrowseData(
	page: number = 1,
	pageSize: number = 10,
	filter: VerificationEntryFilterInput = {},
	order: VerificationEntrySortInput[] = []
) {
	try {
		const ret = await new VerificationEntriesStore().fetch({
			variables: { ...getPageInfo(page, pageSize), filter: filter, order }
		});
		return queryResult(ret, ret.data?.verificationEntries);
	} catch (error) {
		return gqlError(error);
	}
}

export async function readBrowseDataById(id: string) {
	try {
		const ret = await readBrowseData(1, 1, { id: { eq: +id } });
		return getOne(ret, (x) => x!.items);
	} catch (error) {
		gqlError(error);
	}
}

export async function readPollingStations(): Promise<IQuerryResultType<any[]>> {
	return new Promise((resolve, reject) => {
		resolve({
			success: true,
			message: '',
			data: [
				{ id: '1', name: 'Polling Station 1' },
				{ id: '2', name: 'Polling Station 2' }
			]
		});
	});
}

export async function readUploadUsers(): Promise<IQuerryResultType<any[]>> {
	return new Promise((resolve, reject) => {
		resolve({
			success: true,
			message: '',
			data: [
				{ id: '1', name: 'User 1' },
				{ id: '2', name: 'User 2' }
			]
		});
	});
}

export async function readFilesData(
	page: number = 1,
	pageSize: number = 10,
	filter = {},
	order: any[] = []
): Promise<IQuerryResultType<ITableDataProps<IFilesData>>> {
	return new Promise((resolve, reject) => {
		const generateBrowseData = (): IFilesData[] => {
			const data: IFilesData[] = [];
			for (let i = 0; i < 15; i++) {
				data.push({
					id: nanoid(),
					date: randomDate(new Date(2023, 0, 1), new Date(2024, 0, 1)),
					uploadBy: 'Jone Doe',
					numberFailed: Math.floor(1000 + Math.random() * 9000),
					numberManual: Math.floor(1000 + Math.random() * 9000),
					numberSuccessful: Math.floor(1000 + Math.random() * 9000),
					deviceId: `DV-${Math.floor(1000 + Math.random() * 9000)}`,
					pollingStation: pollingStations[Math.floor(Math.random() * pollingStations.length)]
				});
			}
			return data;
		};
		const d = generateBrowseData();
		setTimeout(() => {
			resolve({
				success: true,
				message: '',
				data: {
					pageInfo: { hasNextPage: false, hasPreviousPage: false },
					totalCount: d.length,
					items: d
				}
			});
		}, 400);
	});
}

export async function readFileDataById(id: string): Promise<IQuerryResultType<IFilesData>> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({
				success: true,
				message: '',
				data: {
					id: nanoid(),
					date: randomDate(new Date(2023, 0, 1), new Date(2024, 0, 1)),
					uploadBy: 'Jone Doe',
					numberFailed: Math.floor(1000 + Math.random() * 9000),
					numberManual: Math.floor(1000 + Math.random() * 9000),
					numberSuccessful: Math.floor(1000 + Math.random() * 9000),
					deviceId: `DV-${Math.floor(1000 + Math.random() * 9000)}`,
					pollingStation: pollingStations[Math.floor(Math.random() * pollingStations.length)]
				}
			});
		}, 300);
	});
}
