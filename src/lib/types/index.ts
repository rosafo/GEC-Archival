
export interface IMenuItem {
	title: string;
	icon?: string;
	path?: string;
	items?: IMenuItem[] | null;
	description?: string;
	iconBg?: string;
	iconColor?: string;
	iconSize?: number;
}

export interface IRouteItem {
	name: string;
	items: IMenuItem[];
}
export interface IRouteInfo {
	title: string;
	showBreadCrumb?: boolean;
	dropdownOptions?: IMenuItem[];
	currentDropdownOption?: IMenuItem;
}

export interface IQuerryResultType<T> {
	success: boolean;
	message: string;
	data: T;
}
export interface ICallResultType {
	success: boolean;
	message: string;
	code?: number;
}
