<script lang="ts">
	import Topbar from '$cmps/layout/topbar.svelte';
	import Breadcrumbs from '$cmps/ui/breadcrumbs.svelte';
	import { activePage } from '$data/appStore';
	import { breadCrumb } from '$lib/utils';
	let showAlert = false;
	$: activeBreadCrumb = $breadCrumb[$breadCrumb.length - 1].title;
	function optionClicked({ detail }: any) {
		const { index, path } = detail;
		breadCrumb.removeFromFront(index);
		// goto(path);
	}
</script>

<div class="w-screen h-screen overflow-hidden">
	<div class=" w-full h-full overflow-y-auto">
		<div class="flex flex-col w-full h-full">
			<div class="flex flex-col w-full  sticky top-0 backdrop-blur-lg !bg-[#F0FDF9]">
				<div class="custom-container">
					<Topbar
						user={{ firstName: 'as', lastName: 'ddd' }}
						on:signout={() => (showAlert = true)}
					/>
				</div>
				<div class=" relative">
					<div class="pattern-star z-[-1] opacity-50 lg:opacity-[80%] h-16">
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
				</div>
			</div>
			<div class="flex-grow w-full h-full bg-white pt-3">
				<div class="w-full h-full custom-container">
					<slot />
				</div>
			</div>
		</div>
	</div>
</div>
