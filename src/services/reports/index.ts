import type { IQuerryResultType } from '$lib/types';
import type { IReportType } from '$modules/elections/reports/index.svelte';

export async function readReports(): Promise<IQuerryResultType<IReportType[]>> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({
				success: true,
				message: '',
				data: [
					{
						category: 'Category 1',
						description: 'Description of category 1',
						items: [
							{
								title: 'Report 1',
								description: 'Description for report 1',
								icon: ''
							},
							{
								title: 'Report 2',
								description: 'Description for report 1',
								icon: ''
							},
							{
								title: 'Report 3',
								description: 'Description for report 1',
								icon: ''
							}
						]
					},
					{
						category: 'Category 2',
						description: 'Description of category 2',
						items: [
							{
								title: 'Report 4',
								description: 'Description for report 4',
								icon: ''
							},
							{
								title: 'Report 5',
								description: 'Description for report 5',
								icon: ''
							},
							{
								title: 'Report 6',
								description: 'Description for report 6',
								icon: ''
							}
						]
					}
				]
			});
		}, 400);
	});
}
