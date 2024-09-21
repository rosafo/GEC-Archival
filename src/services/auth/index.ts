import { writable } from 'svelte/store';
import type { IUserInfo } from '../../features/auth/types';
import { showError } from '$lib/utils';
import { loginDetails, login as doLogin } from './account';

export const userInfo = writable<IUserInfo | null>();
export const accessToken = writable('');
export const idToken = writable('');
export const isAuthenticated = writable(false);
export const authError = writable<unknown>();
export const isLoading = writable(true);

let adapter: AuthAdapter;
let initialized = false;

async function setTokenDetails(details: IParsedToken | undefined) {
	if (!details) {
		isAuthenticated.set(false);
		accessToken.set('');
		idToken.set('');
		userInfo.set(<any>null);
	} else {
		isAuthenticated.set(true);
		accessToken.set(adapter.token!);
		idToken.set(adapter.idToken!);
		authError.set(null);
		if (adapter.loginInfo) {
			adapter.loginInfo!.name = `${adapter.loginInfo!.firstName} ${adapter.loginInfo!.lastName}`;
			adapter.loginInfo!.profileImage = adapter.loginInfo!.profileImage || '';
			userInfo.set(adapter.loginInfo!);
		} else {
			setTimeout(async () => {
				try {
					const d = await loginDetails();
					if (d.success) {
						adapter.loginInfo = d.data.result as IUserInfo;
						adapter.loginInfo!.name = `${adapter.loginInfo!.firstName} ${
							adapter.loginInfo!.lastName
						}`;
						adapter.loginInfo!.profileImage = adapter.loginInfo!.profileImage || '';
						userInfo.set(adapter.loginInfo!);
					} else {
						// todo: what to do if we do not get the details we need
						console.log('Login failed with', d);
						showError(d.message);
						signout();
					}
				} catch (e) {
					isAuthenticated.set(false);
					accessToken.set('');
					idToken.set('');
					userInfo.set(<any>null);
					authError.set(e);
				}
			});
		}
	}
}

export async function authInit() {
	adapter = new AuthAdapter();
	try {
		const authenticated = adapter.init({ onLoad: 'login-required', checkLoginIframe: false });
		if (authenticated) {
			setTokenDetails(adapter.idTokenParsed);
		} else {
			setTokenDetails(undefined);
		}
		initialized = true;
		isLoading.set(false);
		// console.log(initialized);
	} catch (e) {
		initialized = false;
		console.log(initialized, e);

		authError.set(e ? e : 'Not initialized');
	}
}

export async function refreshToken() {
	if (!initialized) return;
	try {
		const refreshed = await adapter.updateToken(30);
		if (refreshed) {
			setTokenDetails(adapter.idTokenParsed);
		}
	} catch (e) {
		// todo: what to do with this?
	}
}

export async function signout() {
	// todo: call the server to invalidate the token
	localStorage.removeItem(AuthAdapter.lsKey);
	window.location.href = '/';
}

export async function login(username: string, password: string) {
	// console.log(initialized)
	if (initialized) {
		const authenticated = await adapter.login(username, password);
		if (authenticated) {
			setTokenDetails(adapter.idTokenParsed);
		} else {
			setTokenDetails(undefined);
		}
	}
}

class AuthAdapter {
	refreshToken?: string;
	token?: string;
	idToken?: string;
	idTokenParsed?: IParsedToken;
	refreshTokenParsed?: IParsedToken;
	authenticated: boolean = false;
	lastError: unknown;
	static loginUrl: string = '/login';
	static lsKey = '__q';
	loginInfo?: IUserInfo;
	prevUrl?: string;

	init(config: IAuthAdapterConfig) {
		this.authenticated = false;
		var data = localStorage.getItem(AuthAdapter.lsKey); // could be from a cookie
		if (data == null) return this.handleConfig(config);
		try {
			const authData = JSON.parse(data) as ITokenInfo;
			if (authData == null) return false;

			this.token = authData.accessToken;
			this.idToken = authData.accessToken;
			this.refreshToken = authData.refreshToken;
			this.idTokenParsed = AuthAdapter.parseJwt(this.idToken);
			this.refreshTokenParsed = AuthAdapter.parseJwt(this.refreshToken);
			this.authenticated = this.hasValidToken();
			// todo: check if not expired
			return true;
		} catch (e) {
			this.lastError = e;
			return false;
		}
	}

	async login(username: string, password: string) {
		try {
			var ret = await doLogin(username, password);
			if (ret.success) {
				this.token = ret.data.result?.token;
				this.idToken = ret.data.result?.token;
				this.refreshToken = ret.data.result?.token; // todo: get correct refresh token
				// save
				this.idTokenParsed = AuthAdapter.parseJwt(this.idToken as string);
				this.refreshTokenParsed = AuthAdapter.parseJwt(this.refreshToken as string);

				if (this.idTokenParsed) {
					const response = await loginDetails();
					if (response.success) {
						this.loginInfo = response.data.result as IUserInfo;
					}
					const tokens = {
						accessToken: this.idToken!,
						refreshToken: this.refreshToken!
					};
					localStorage.setItem(AuthAdapter.lsKey, JSON.stringify(tokens));
				}
				this.authenticated = !!this.idTokenParsed;
				return this.authenticated;
			} else {
				this.lastError = ret.message;
				showError(ret.message);
				return false;
			}
		} catch (e) {
			this.lastError = e;
			return false;
		}
	}
	async updateToken(minExpiration: number) {
		if (!this.refreshToken) return false;
		if (this.idTokenParsed) {
			const timeLeft = this.idTokenParsed.exp - new Date().getTime() / 1000; // todo: apply gmt. This will fail if not +0
			if (timeLeft > minExpiration) return false;
		}
		// todo: make the request for the new refresh token
		return false;
	}
	private handleConfig(config: IAuthAdapterConfig) {
		if (config.onLoad === 'check-sso') return;
		if (config.onLoad === 'login-required') {
			// todo: go to the login page
			if (!window.location.href.includes(AuthAdapter.loginUrl)) {
				this.prevUrl = window.location.href;
				window.location.href = AuthAdapter.loginUrl;
			}
		}
	}
	private hasValidToken() {
		if (!this.idTokenParsed) return false;
		return this.idTokenParsed.exp > new Date().getTime() / 1000;
	}
	private static parseJwt(token: string) {
		try {
			var b64 = token.split('.')[1];
			b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
			var jsonPayload = decodeURIComponent(
				window
					.atob(b64)
					.split('')
					.map(function (c) {
						return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
					})
					.join('')
			);

			return JSON.parse(jsonPayload) as IParsedToken;
		} catch (e) {
			// todo: log this
			return undefined;
		}
	}
}

interface IParsedToken {
	aud: string;
	exp: number;
	fundId: string;
	id: string;
	iss: number;
	staffNumber: string;
	scope: string;
	name: string;
}
interface IAuthAdapterConfig {
	onLoad: 'check-sso' | 'login-required';
	checkLoginIframe: boolean;
}
interface ITokenInfo {
	readonly accessToken: string;
	readonly refreshToken: string;
}
