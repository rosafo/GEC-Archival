<script>
	import { userInfo, isAuthenticated, authInit } from '$svc/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	$: if ($userInfo && $isAuthenticated) {
		let url = '/private/home';
		goto(url);
	}
	onMount(async () => {
		await authInit();
		// interval = setInterval(refreshToken, 10000); // refresh every 30s
	});
</script>

<slot />
