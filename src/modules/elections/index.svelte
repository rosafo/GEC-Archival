<script lang="ts">
	import { onMount } from 'svelte';
	import Dashboard from './dashboard.svelte';
	import Files from './files.svelte';
	import Browse from './browse.svelte';
	import Reports from './reports.svelte';
	import Tabs, { type Tab } from '$cmps/ui/tabs.svelte';
	import { breadCrumb, showError } from '$lib/utils';
	import { readElectionById } from '$svc/elections';
	import { activePage } from '$data/appStore';

	export let electionId = '';

	let tabs: Tab[] = [
		{ id: 1, label: 'Dashboard', component: Dashboard, icon: 'hugeicons:dashboard-square-setting' },
		{ id: 2, label: 'Browse', component: Browse, icon: 'bi:browser-safari' },
		{ id: 3, label: 'Files', component: Files, icon: 'mage:file-records' },
		{ id: 4, label: 'Reports', component: Reports, icon: 'mdi:report-timeline' }
	];

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

	onMount(async () => {
		try {
			const ret = await readElectionById(electionId);
			if (!ret.success) {
				showError(ret.message);
				return;
			}
			electionName = ret.data.name;
		} catch (error: any) {
			showError(error?.message || error);
		}
	});
</script>

<Tabs {tabs} bind:activeTab />
