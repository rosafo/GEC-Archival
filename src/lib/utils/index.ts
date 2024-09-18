import type { IBreadCrumb } from '$cmps/ui/breadcrumbs.svelte';
import { toast, type ToastOptions } from 'svelte-french-toast';
import { writable } from 'svelte/store';
import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';
import { nanoid } from 'nanoid';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function extractRedirectToRoute(queryString: string): string | null {
	const match = queryString.split('=')[1];
	return match ? match : null;
}

export function createBreadCrumb() {
	const { subscribe, set, update } = writable<IBreadCrumb[]>([{ title: 'Home' }]);
	return {
		subscribe,
		addToFirstIndex: (newCrumb: IBreadCrumb | IBreadCrumb[], clear = false) => {
			update((value) => {
				if (clear) {
					return Array.isArray(newCrumb) ? [...newCrumb] : [newCrumb];
				}

				if (Array.isArray(newCrumb)) {
					return [...newCrumb, ...value];
				} else if (newCrumb) {
					return [newCrumb, ...value];
				}

				return value;
			});
		},
		addToLastIndex: (newCrumb: IBreadCrumb) => {
			update((value) => {
				if (Array.isArray(newCrumb)) {
					return [...value, ...newCrumb];
				} else if (newCrumb) {
					return [...value, newCrumb];
				}
				return value;
			});
		},
		removeFromFront: (index: number) => {
			update((value) => {
				return value.slice(0, index + 1);
			});
		},
		reset: () => set([{ title: 'Home' }])
	};
}
export const breadCrumb = createBreadCrumb();

export function showError(message: string) {
	toast.error(message, { duration: 7000 });
}

export function showInfo(message: string) {
	// info(message)
	toast.success(message);
}

interface ToastPromiseOptions {
	promise: Promise<any>;
	loading: string;
	success: string;
	error: string;
	options?: ToastOptions;
}

export const showPromise = async ({
	promise,
	loading,
	success,
	error,
	options
}: ToastPromiseOptions) => {
	let id = nanoid();
	try {
		toast.loading(loading, options);
		const result = await promise;
		toast.success(success, { ...options, id: `${id}-${success}` });
		return result;
	} catch (err) {
		toast.error(error, { ...options, id: `${id}-${error}` });
		throw err;
	}
};

export function getMonthName(monthNumber: number): string {
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	if (monthNumber < 1 || monthNumber > 12) {
		throw new Error('Invalid month number. Please provide a number between 1 and 12.');
	}

	return monthNames[monthNumber - 1];
}

export function extractQueryParam(queryString: string, index: string = 'q'): string {
	const urlParams = new URLSearchParams(queryString);
	const warehouse = urlParams.get(index);
	return warehouse ?? '';
}
