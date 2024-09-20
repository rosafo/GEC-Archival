import type { ICallResultType, IQuerryResultType, ITableDataProps } from '$lib/types';
import type { IBrowseData } from '$modules/elections/browse/index.svelte';
import type { IElectionDashoardTypes } from '$modules/elections/dashboard.svelte';
import type { IFilesData } from '$modules/elections/files/index.svelte';
import type { IElectionToPlot } from '$modules/home/index.svelte';
import { nanoid } from 'nanoid';

export interface IElectionDto {
	name: string;
	year: number;
	month: number;
}

export interface IElection extends IElectionDto {
	id: string;
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
export async function readElections(): Promise<IQuerryResultType<any[]>> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({
				success: true,
				message: '',
				data: data
			});
		}, 500);
	});
}

export async function createElection(params: IElectionDto): Promise<ICallResultType> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({ success: true, message: 'Created Election' });
		}, 300);
	});
}

export async function readElectionGraph(): Promise<IQuerryResultType<IElectionToPlot[]>> {
	return new Promise((resolve, reject) => { // todo: use: verificationsByGender
		setTimeout(() => {
			resolve({
				success: true,
				message: '',
				data: [
					{ name: "2000", males: 120, females: 90, date: new Date() },
					{ name: "2004", males: 200, females: 180, date: new Date() },
					{ name: "2008", males: 150, females: 130, date: new Date() },
					{ name: "2012", males: 80, females: 110, date: new Date() },
					{ name: "2016", males: 70, females: 120, date: new Date() },
					{ name: "2020", males: 110, females: 140, date: new Date() },
					{ name: "2024", males: 130, females: 150, date: new Date() }
				]
			});
		}, 500);
	});
}

export async function readElectionDashboard(
	id: string
): Promise<IQuerryResultType<IElectionDashoardTypes>> {
	return new Promise((resolve, reject) => { // todo: electionSummary
		setTimeout(() => {
			resolve({
				success: true,
				message: '',
				data: {
					counts: {
						invalidVoters: 1000,
						validVoters: 90000,
						numberOfActivities: 91000,
						numberOfDevices: 500000,
						numberOfFiles: 50000,
						numberOfPollingStations: 70000
					},
					verifications: {
						successful: [
							{ name: 'Male', count: 30000 },
							{ name: 'Female', count: 20000 }
						],
						failed: [
							{ name: 'Male', count: 1000 },
							{ name: 'Female', count: 2000 }
						],
						manual: [
							{ name: 'Male', count: 500 },
							{ name: 'Female', count: 300 }
						]
					},
					overTime: [
						{ hour: '7 AM', successful: 20, failed: 5, manual: 3 },
						{ hour: '8 AM', successful: 25, failed: 3, manual: 4 },
						{ hour: '9 AM', successful: 22, failed: 7, manual: 2 },
						{ hour: '10 AM', successful: 30, failed: 2, manual: 6 },
						{ hour: '11 AM', successful: 28, failed: 6, manual: 4 },
						{ hour: '12 PM', successful: 32, failed: 1, manual: 3 },
						{ hour: '1 PM', successful: 29, failed: 4, manual: 5 },
						{ hour: '2 PM', successful: 31, failed: 3, manual: 4 },
						{ hour: '3 PM', successful: 26, failed: 5, manual: 6 },
						{ hour: '4 PM', successful: 24, failed: 7, manual: 5 },
						{ hour: '5 PM', successful: 33, failed: 2, manual: 7 },
						{ hour: '6 PM', successful: 27, failed: 3, manual: 4 },
						{ hour: '7 PM', successful: 28, failed: 8, manual: 1 }
					]
				}
			});
		}, 500);
	});
}

export async function readElectionById(id: string): Promise<IQuerryResultType<IElection>> {
	return new Promise((resolve, reject) => {
		resolve({ success: true, message: '', data: data.find((x) => x.id === id) || data[0] });
	});
}

function randomDate(start: Date, end: Date): Date {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const statuses = ['Verified', 'Pending', 'Rejected', 'In Progress'];
const verificationTypes = ['Finger', 'Face', 'Manual'];
const pollingStations = ['Station 1', 'Station 2', 'Station 3', 'Station 4'];

export async function readBrowseData(
	page: number = 1,
	pageSize: number = 10,
	filter = {},
	order: any[] = []
): Promise<IQuerryResultType<ITableDataProps<IBrowseData>>> {
	return new Promise((resolve, reject) => {
		const generateBrowseData = (): IBrowseData[] => {
			const data: IBrowseData[] = [];
			for (let i = 0; i < 15; i++) {
				data.push({
					id: nanoid(),
					date: randomDate(new Date(2023, 0, 1), new Date(2024, 0, 1)),
					voterId: `VTR-${Math.floor(1000 + Math.random() * 9000)}`,
					verificationType: verificationTypes[Math.floor(Math.random() * verificationTypes.length)],
					status: statuses[Math.floor(Math.random() * statuses.length)],
					notes: `Note for voter ${i + 1}`,
					gender: 'Male',
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

export async function readBrowseDataById(id: string): Promise<IQuerryResultType<IBrowseData>> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({
				success: true,
				message: '',
				data: {
					id: nanoid(),
					date: randomDate(new Date(2023, 0, 1), new Date(2024, 0, 1)),
					voterId: `VTR-${Math.floor(1000 + Math.random() * 9000)}`,
					verificationType: verificationTypes[Math.floor(Math.random() * verificationTypes.length)],
					status: statuses[Math.floor(Math.random() * statuses.length)],
					notes: `Note for voter 1`,
					pollingStation: pollingStations[Math.floor(Math.random() * pollingStations.length)],
					gender: 'Male'
				}
			});
		}, 300);
	});
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
