import {
	CreateElectionStore,
	LogUploadStore,
	ReadElectionsStore,
	ReadElectionSummaryStore,
	ReadGenderVerficationsStore,
	VerificationEntriesStore,
	VerificationFilesStore,
	type ElectionFilterInput,
	type ElectionSortInput,
	type ElectionType$options,
	type VerificationEntryFilterInput,
	type VerificationEntrySortInput,
	type VerificationFileFilterInput,
	type VerificationFileSortInput
} from '$houdini';
import type { IQuerryResultType } from '$lib/types';

import { callResult, getOne, getPageInfo, gqlError, queryResult } from '$svc/shared';

export interface IElectionDto {
	name: string;
	startDate: Date;
	endDate: Date;
	electionType: 'BY_ELECTION' | 'NATIONAL_ELECTION';
}

export interface IElection extends IElectionDto {
	id: number;
}

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
	filter: VerificationFileFilterInput = {},
	order: VerificationFileSortInput[] = []
) {
	try {
		const ret = await new VerificationFilesStore().fetch({
			variables: { ...getPageInfo(page, pageSize), filter: filter, order }
		});
		return queryResult(ret, ret.data?.verificationFiles);
	} catch (error) {
		return gqlError(error);
	}
}

export async function readFileDataById(id: string) {
	try {
		const ret = await readFilesData(1, 1, { id: { eq: +id } });
		return getOne(ret, (x) => x!.items);
	} catch (error) {
		gqlError(error);
	}
}

export async function uploadLogs(input: File) {
	try {
		const ret = await new LogUploadStore().mutate({ input: { file: input } });
		return callResult(ret, ret.data?.uploadFile);
	} catch (error) {
		gqlError(error);
	}
}
