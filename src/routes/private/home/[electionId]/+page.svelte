<script lang="ts">
	import { page } from '$app/stores';
	import { activePage } from '$data/appStore';
	import { breadCrumb, extractQueryParam } from '$lib/utils';
	import Election from '$modules/elections/index.svelte';

	$: projectName = extractQueryParam($page.url.search, 'name') || '';

	$: activePage.set({ title: projectName, showBreadCrumb: true });
	$: breadCrumb.addToFirstIndex(
		[
			{ title: 'Home', path: '/private/home' },
			{ title: projectName, path: '' }
		],
		true
	);
</script>

<Election />
