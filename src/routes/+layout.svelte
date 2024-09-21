<script>
	import '../app.css';
	import { Toaster } from 'svelte-french-toast';
	import 'iconify-icon';
	import { onMount } from 'svelte';
	import { userInfo } from '$svc/auth';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import advancedFormat from 'dayjs/plugin/advancedFormat';
	import dayjs from 'dayjs';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	dayjs.extend(relativeTime);
	dayjs.extend(advancedFormat);

	$: user = $userInfo;
	$: if (browser && user) {
		const location = window.location.href;
		if (location.endsWith('/') || location.endsWith('/private')) {
			goto('/private/home');
		}
	} else if (browser && window.location.pathname === '/') {
		goto('/private/home');
		// } else {

		//     console.log("no user", window.location)
	}

	// TODO: Remove this
	// onMount(() => {
	// 	userInfo.set({
	// 		firstName: 'Test',
	// 		lastName: 'K',
	// 		middleName: 'user',
	// 		name: 'Test User',
	// 		role: 'user',
	// 		username: 'testuser',
	// 		initials: 'TKU',
	// 		profileImage: 'https://th.bing.com/th/id/OIP.39Zx7r6-ia_7-3LtsXdB1QAAAA?rs=1&pid=ImgDetMain',
	// 		permissions: [
	// 			'CanAddElection',
	// 			'CanViewElections',
	// 			'CanUploadLogs',
	// 			'CanBrowse',
	// 			'CanViewFiles',
	// 			'CanViewReports'
	// 		],
	// 		tags: []
	// 	});
	// });
</script>

<Toaster
	toastOptions={{
		style: 'background: #363636; color: #fff;'
	}}
/>
<slot />
