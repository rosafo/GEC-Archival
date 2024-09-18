import type { ICallResultType, IQuerryResultType } from '$lib/types';
import type { IElectionToPlot } from '$modules/home/index.svelte';

export interface IElectionDto {
	name: string;
	year: number;
	month: number;
}

export interface IElection extends IElectionDto {
	id: number;
}

export async function readElections(): Promise<IQuerryResultType<any[]>> {
	const data: IElection[] = [
		{
			name: '2000 Election',
			year: 2000,
			month: 12,
			id: 1
		},
		{
			name: '2004 Election',
			year: 2004,
			month: 12,

			id: 2
		},
		{
			name: '2008 Election',
			year: 2008,
			month: 12,

			id: 3
		},
		{
			name: '2012 Election',
			year: 2012,
			month: 12,

			id: 4
		},
		{
			name: '2016 Election',
			year: 2016,
			month: 12,

			id: 5
		},
		{
			name: '2020 Election',
			year: 2020,
			month: 12,

			id: 6
		},
		{
			name: '2024 Election',
			year: 2024,
			month: 12,

			id: 7
		}
	];
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
