import type { IQuerryResultType, ITableDataProps } from '$lib/types';
import type { IReport } from '$modules/reports/index.svelte';
import type { IRole } from '$modules/roles/index.svelte';
import type { IUser } from '$modules/users/index.svelte';

export async function readRoles(): Promise<IQuerryResultType<ITableDataProps<IRole>>> {
	return new Promise((resolve, reject) => {
		resolve({
			success: true,
			message: '',
			data: {
				pageInfo: { hasNextPage: false, hasPreviousPage: false },
				items: [
					{ name: 'Test 1', permissions: ['canAddElection'], id: 1, notes: 'test' },
					{ name: 'Test 2', permissions: ['canAddElection'], id: 2, notes: 'test' }
				],
				totalCount: 2
			}
		});
	});
}

export async function readPermissions(): Promise<IQuerryResultType<string[]>> {
	return new Promise((resolve, reject) => {
		resolve({
			success: true,
			message: '',
			data: ['canAddElections']
		});
	});
}

export async function readUsers(): Promise<IQuerryResultType<ITableDataProps<IUser>>> {
	return new Promise((resolve, reject) => {
		resolve({
			success: true,
			message: '',
			data: {
				pageInfo: { hasNextPage: false, hasPreviousPage: false },
				totalCount: 2,
				items: [
					{
						id: 1,
						firstName: 'John',
						username: 'jdoe',
						surname: 'Doe',
						otherNames: '',
						role: 'Super Admin',
						roleId: 1,
						status: 'Active'
					},
					{
						id: 2,
						firstName: 'Paul',
						username: 'jdoe',
						surname: 'Kusi',
						otherNames: 'Kwasi',
						role: 'Super Admin',
						roleId: 1,
						status: 'Active'
					}
				]
			}
		});
	});
}

export async function getAllReports(): Promise<IQuerryResultType<ITableDataProps<IReport>>> {
	return new Promise((resolve, reject) => {
		resolve({
			success: true,
			message: '',
			data: {
				pageInfo: { hasNextPage: false, hasPreviousPage: false },
				totalCount: 1,
				items: [
					{
						id: 1,
						name: 'Demo',
						description: 'demo description',
						formDefinition: '',
						parameters: '',
						active: true,
						category: 'demo catgory'
					}
				]
			}
		});
	});
}

export async function getReport(id: number) {}

export async function getReportParamsFromUpload(input: { reportFile: File }) {

}
