import { gqlError, queryResult } from '../shared';
import { AuthUserStore, LoginStore } from '$houdini';

export async function login(username: string, password: string) {
	try {
		const ret = await new LoginStore().mutate({ input: { username, password } });
		return queryResult(ret, ret.data?.login);
	} catch (e) {
		return gqlError(e);
	}
}

export async function loginDetails() {
	try {
		const ret = await new AuthUserStore().fetch();
		return queryResult(ret, ret.data?.me);
	} catch (e) {
		return gqlError(e);
	}
}
