<script>
	import '../app.css';
	import { Toaster } from 'svelte-french-toast';
	import 'iconify-icon';
	import { onMount } from 'svelte';
	import { userInfo } from '$svc/auth';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import advancedFormat from 'dayjs/plugin/advancedFormat';
	import dayjs from 'dayjs';

	dayjs.extend(relativeTime);
	dayjs.extend(advancedFormat);

	// TODO: Remove this
	onMount(() => {
		userInfo.set({
			firstName: 'Test',
			lastName: 'K',
			middleName: 'user',
			name: 'Test User',
			role: 'user',
			username: 'testuser',
			initials: 'TKU',
			profileImage: 'https://th.bing.com/th/id/OIP.39Zx7r6-ia_7-3LtsXdB1QAAAA?rs=1&pid=ImgDetMain',
			permissions: [
				'CanAddElection',
				'CanViewElections',
				'CanUploadLogs',
				'CanBrowse',
				'CanViewFiles',
				'CanViewReports'
			],
			tags: []
		});
	});
</script>

<Toaster
	toastOptions={{
		style: 'background: #363636; color: #fff;'
	}}
/>
<slot />
