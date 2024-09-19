export interface IUserInfo {
	firstName: string;
	lastName: string;
	middleName: string;
	name: string;
	role: string;
	username: string;
	initials: string;
	profileImage: string;
	permissions: PermissionTypes[];
	tags: string[];
}

export type PermissionTypes =
	| 'CanAddElection'
	| 'CanViewElections'
	| 'CanUploadLogs'
	| 'CanBrowse'
	| 'CanViewFiles'
	| 'CanViewReports';
