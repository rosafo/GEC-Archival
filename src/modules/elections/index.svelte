<script lang="ts">
	import { onMount } from 'svelte';
	import Dashboard from './dashboard.svelte';
	import Files from './files/index.svelte';
	import Browse from './browse/index.svelte';
	import Reports from './reports/index.svelte';
	import Tabs, { type Tab } from '$cmps/ui/tabs.svelte';
	import { breadCrumb, showError } from '$lib/utils';
	import { readElectionById } from '$svc/elections';
	import { activePage } from '$data/appStore';
	import Viewer from './reports/viewer.svelte';
	import Uploads from './reports/logsUpload.svelte';
	import { userInfo } from '$svc/auth';

	export let electionId = '';

	let tabs: Tab[] = [
		{
			id: 1,
			label: 'Dashboard',
			component: Dashboard,
			icon: 'hugeicons:dashboard-square-setting',
			props: { electionId }
		},
		{ id: 2, label: 'Browse', component: Browse, icon: 'bi:browser-safari' },
		{ id: 3, label: 'Files', component: Files, icon: 'mage:file-records' },
		{ id: 4, label: 'Reports', component: Reports, icon: 'mdi:report-timeline' },
		{ id: 5, label: 'Uploads', component: Uploads, icon: 'lets-icons:upload-fill' }
	];

	const tabPermissionsMap: Record<string, string> = {
		Dashboard: 'CanViewElections',
		Browse: 'CanBrowse',
		Files: 'CanViewFiles',
		Reports: 'CanViewReports',
		Uploads: 'CanUploadLogs'
	};

	$: filteredTabs = tabs.filter(
		(tab) => $userInfo && $userInfo.permissions.includes(tabPermissionsMap[tab.label])
	) as Tab[];

	let activeTab = 1;
	let electionName = '';
	$: activePage.set({ title: electionName, showBreadCrumb: true });
	$: breadCrumb.addToFirstIndex(
		[
			{ title: 'Home', path: '/private/home' },
			{ title: electionName, path: '' }
		],
		true
	);

	function removeTab({ detail }: CustomEvent) {
		const { tabId } = detail;
		if (!filteredTabs.find((x) => x.id === tabId)) return;
		filteredTabs = filteredTabs.filter((x) => x.id !== tabId);
		activeTab = filteredTabs.length - 1;
	}

	function addTab({ detail }: CustomEvent) {
		const { title } = detail;
		const randomId = Math.floor(Math.random() * 10000);
		filteredTabs = [
			...filteredTabs,
			{
				id: randomId,
				label: title,
				component: Viewer,
				icon: 'mdi:report-pie',
				isClosable: true
			}
		];
		activeTab = randomId;
	}

	onMount(async () => {
		try {
			const ret = await readElectionById(electionId);
			if (!ret?.success) {
				showError(ret?.message || '');
				return;
			}
			electionName = ret.data.name;
		} catch (error: any) {
			showError(error?.message || error);
		}
	});
</script>

<Tabs tabs={filteredTabs} bind:activeTab on:removeItem={removeTab} on:addTab={addTab} />
