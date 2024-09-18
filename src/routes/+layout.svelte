<script>
	import '../app.css';
	import { Toaster } from 'svelte-french-toast';
	import '../app.css';
	import 'iconify-icon';
</script>

<Toaster
	toastOptions={{
		style: 'background: #363636; color: #fff;'
	}}
/>
<slot />
