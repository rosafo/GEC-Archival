import type { IRouteInfo } from '$lib/types';
import { writable } from 'svelte/store';

export let activePage = writable<IRouteInfo>({
	title: 'Dashboard',
	showBreadCrumb: false
});
