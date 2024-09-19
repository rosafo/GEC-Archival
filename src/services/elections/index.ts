import type { ICallResultType, IQuerryResultType } from '$lib/types';
import type { IElectionDashoardTypes } from '$modules/elections/dashboard.svelte';
import type { IElectionToPlot } from '$modules/home/index.svelte';

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
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({
				success: true,
				message: '',
				data: [
					{ year: 2000, males: 120, females: 90 },
					{ year: 2004, males: 200, females: 180 },
					{ year: 2008, males: 150, females: 130 },
					{ year: 2012, males: 80, females: 110 },
					{ year: 2016, males: 70, females: 120 },
					{ year: 2020, males: 110, females: 140 },
					{ year: 2024, males: 130, females: 150 }
				]
			});
		}, 500);
	});
}

export async function readElectionDashboard(
	id: string
): Promise<IQuerryResultType<IElectionDashoardTypes>> {
	return new Promise((resolve, reject) => {
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
