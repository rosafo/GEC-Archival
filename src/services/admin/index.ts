import {
	AllReportsStore,
	CreateReportStore,
	CreateRoleStore,
	CreateUserStore,
	DeleteReportStore,
	DeleteRoleStore,
	DeleteUserStore,
	GetReportParamsFromUploadStore,
	MyReportsStore,
	ReadPermissionsStore,
	ReadRolesStore,
	ReadUsersStore,
	UpdateReportStore,
	UpdateRoleStore,
	UpdateUserStore,
	type CreateReportInput,
	type CreateRoleInput,
	type CreateUserInput,
	type DeleteRoleInput,
	type DeleteUserInput,
	type ReportDefinitionFilterInput,
	type ReportDefinitionSortInput,
	type RoleFilterInput,
	type RoleSortInput,
	type UpdateReportInput,
	type UpdateRoleInput,
	type UpdateUserInput,
	type UserFilterInput,
	type UserSortInput
} from '$houdini';
import type { IQuerryResultType, ITableDataProps } from '$lib/types';
import type { IReport } from '$modules/reports/index.svelte';
import type { IRole } from '$modules/roles/index.svelte';
import type { IUser } from '$modules/users/index.svelte';
import { callResult, getOne, getPageInfo, gqlError, queryResult } from '$svc/shared';

export async function readRoles(
	page: number = 1,
	pageSize: number = 10,
	filter: RoleFilterInput = {},
	order: RoleSortInput[] = []
) {
	try {
		const ret = await new ReadRolesStore().fetch({
			variables: { ...getPageInfo(page, pageSize), filter: filter, order }
		});
		return queryResult(ret, ret.data?.roles);
	} catch (error) {
		return gqlError(error);
	}
}

export async function readRoleById(id: number) {
	try {
		const ret = await readRoles(1, 1, { id: { eq: id } });
		return getOne(ret, (x) => x!.items);
	} catch (error) {
		gqlError(error);
	}
}

export async function createRole(params: CreateRoleInput) {
	try {
		const ret = await new CreateRoleStore().mutate({ input: params });
		return callResult(ret, ret.data?.createRole as any);
	} catch (error) {
		gqlError(error);
	}
}

export async function updateRole(params: UpdateRoleInput) {
	try {
		const ret = await new UpdateRoleStore().mutate({ input: params });
		return callResult(ret, ret.data?.updateRole as any);
	} catch (error) {
		gqlError(error);
	}
}

export async function deleteRole(params: DeleteRoleInput) {
	try {
		const ret = await new DeleteRoleStore().mutate({ input: params });
		return callResult(ret, ret.data?.deleteRole as any);
	} catch (error) {
		gqlError(error);
	}
}

export async function readPermissions() {
	try {
		const ret = await new ReadPermissionsStore().fetch();
		return queryResult(ret, ret.data?.permissions);
	} catch (error) {
		gqlError(error);
	}
}

export async function readUsers(
	page: number = 1,
	pageSize: number = 10,
	filter: UserFilterInput = {},
	order: UserSortInput[] = []
) {
	try {
		const ret = await new ReadUsersStore().fetch({
			variables: { ...getPageInfo(page, pageSize), filter: filter, order }
		});
		return queryResult(ret, ret.data?.users);
	} catch (error) {
		return gqlError(error);
	}
}

export async function getAllReports(
	active: boolean,
	page: number = 1,
	pageSize: number = 10,
	filter: ReportDefinitionFilterInput = {},
	order: ReportDefinitionSortInput[] = []
) {
	try {
		const ret = await new AllReportsStore().fetch({
			variables: {
				input: { isActive: active },
				...getPageInfo(page, pageSize),
				filter: filter,
				order
			}
		});
		return queryResult(ret, ret.data?.reports);
	} catch (error) {
		return gqlError(error);
	}
}

export async function getReport(id: number) {
	try {
		const ret = await getAllReports(true, 1, 1, { id: { eq: id } });
		return getOne(ret, (x) => x!.items);
	} catch (error) {
		gqlError(error);
	}
}

export async function getReportParamsFromUpload(input: { reportFile: File }) {
	try {
		const ret = await new GetReportParamsFromUploadStore().fetch({ variables: { input } });
		return queryResult(ret, ret.data?.reportParametersFromFile);
	} catch (e) {
		return gqlError(e);
	}
}

export async function deleteReport(input: number) {
	try {
		const ret = await new DeleteReportStore().mutate({ command: { id: input } });
		return callResult(ret, ret.data?.deleteReport as any);
	} catch (e) {
		return gqlError(e);
	}
}

export async function myReports() {
	try {
		const ret = await new MyReportsStore().fetch();
		return queryResult(ret, ret.data?.myReports);
	} catch (e) {
		return gqlError(e);
	}
}

export async function createReport(input: CreateReportInput) {
	try {
		const ret = await new CreateReportStore().mutate({ input });
		return callResult(ret, ret.data?.createReport as any);
	} catch (e) {
		return gqlError(e);
	}
}

export async function updateReport(input: UpdateReportInput) {
	try {
		const ret = await new UpdateReportStore().mutate({ input });
		return callResult(ret, ret.data?.updateReport as any);
	} catch (e) {
		return gqlError(e);
	}
}

export async function updateUser(input: UpdateUserInput) {
	try {
		const ret = await new UpdateUserStore().mutate({ input });
		return callResult(ret, ret.data?.updateUser as any);
	} catch (e) {
		return gqlError(e);
	}
}

export async function createUser(input: CreateUserInput) {
	try {
		const ret = await new CreateUserStore().mutate({ input });
		return callResult(ret, ret.data?.createUser as any);
	} catch (e) {
		return gqlError(e);
	}
}

export async function deleteUser(input: number) {
	try {
		const ret = await new DeleteUserStore().mutate({ input: { id: input } });
		return callResult(ret, ret.data?.deleteUser as any);
	} catch (e) {
		return gqlError(e);
	}
}

export async function getUserById(id: number) {
	try {
		const ret = await readUsers(1, 1, { id: { eq: id } });
		return getOne(ret, (x) => x!.items);
	} catch (error) {
		gqlError(error);
	}
}
