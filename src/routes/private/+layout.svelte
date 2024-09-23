<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Topbar from '$cmps/layout/topbar.svelte';
	import AlertDialog from '$cmps/ui/AlertDialog.svelte';
	import Breadcrumbs from '$cmps/ui/breadcrumbs.svelte';
	import { activePage } from '$data/appStore';
	import type { IMenuItem } from '$lib/types';
	import { breadCrumb } from '$lib/utils';
	import { authInit, refreshToken, signout, userInfo } from '$svc/auth';
	import { onDestroy, onMount } from 'svelte';
	let showAlert = false;
	let interval: NodeJS.Timer;

	$: activeBreadCrumb = $breadCrumb[$breadCrumb.length - 1].title;
	function optionClicked({ detail }: any) {
		const { index, path } = detail;
		breadCrumb.removeFromFront(index);
		// goto(path);
	}

	function logout() {
		signout();
		goto('/');
	}

	onMount(async () => {
		await authInit();
		interval = setInterval(refreshToken, 10000);
	});
	onDestroy(() => clearInterval(interval));

	$: isAdminRoute = $page.url.pathname && $page.url.pathname.includes('/private/admin');

	const adminLink: IMenuItem[] = [
		{ title: 'Home', path: '/private/home' },
		{ title: 'Roles', path: '/private/admin/roles' },
		{ title: 'Reports Management', path: '/private/admin/reports' },
		{ title: 'User Management', path: '/private/admin/users' }
	];
</script>

<div class="w-screen h-screen overflow-hidden bg-gray-50/50">
	<!-- <div class=" w-full h-full overflow-y-auto"> -->
	<div class="flex flex-col w-full h-full overflow-y-auto">
		<div class="flex flex-col w-full sticky top-0 z-10 backdrop-blur-lg !bg-[#F0FDF9]">
			<div class="custom-container">
				<Topbar user={$userInfo} on:signout={() => (showAlert = true)} />
			</div>
			<div class=" relative">
				<div class="pattern-star z-[-1] opacity-50 lg:opacity-[80%] h-16">
					{#if !isAdminRoute}
						<div>
							<p
								class="custom-container text-xl font-semibold tracking-tighter"
								class:pt-2={$activePage.showBreadCrumb}
								class:pt-5={!$activePage.showBreadCrumb}
							>
								{$activePage.title}
							</p>
							{#if $activePage.showBreadCrumb}
								<div class="custom-container mb-4">
									<Breadcrumbs options={$breadCrumb} {activeBreadCrumb} on:click={optionClicked} />
								</div>
							{/if}
						</div>
					{:else}
						<div class="custom-container flex flex-wrap items-center h-full">
							{#each adminLink as link}
								{@const isActive = link.path === $page.url.pathname}
								<a
									href={link.path}
									class=" px-4 py-2 h-full flex items-center border-b-[3px] tracking-tight font-medium"
									class:inactive={!isActive}
									class:active={isActive}>{link.title}</a
								>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
		<div class="flex-grow w-full h-full pt-3">
			<div class="w-full h-full custom-container flex-grow">
				<slot />
			</div>
		</div>
	</div>
	<!-- </div> -->
</div>
<AlertDialog
	bind:open={showAlert}
	message="Are you sure you want to sign out?"
	on:cancel={() => (showAlert = false)}
	on:yes={logout}
/>

<style>
	.active {
		@apply bg-[#168e6898] border-[#168e68];
	}
	.inactive {
		@apply border-transparent hover:bg-[#168e6823];
	}
</style>
