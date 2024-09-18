<script>
	import { activePage } from '$data/appStore';
	import Home from '$modules/home/index.svelte';
	activePage.set({ title: 'Home', showBreadCrumb: false });
</script>

<Home />
