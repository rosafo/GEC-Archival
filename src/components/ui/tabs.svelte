<script lang="ts" context="module">
	export interface Tab {
		id: number;
		label: string;
		component: any;
		icon?: string;
	}
</script>

<script lang="ts">
	export let tabs: Tab[] = [];
	export let activeTab = 1;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function changeTab(id: number) {
		activeTab = id;
		dispatch('tabChange', { activeTab });
	}
</script>

<div class="flex flex-col w-full h-full">
	<div class="flex space-x-4 border-b-2 mb-4">
		{#each tabs as tab}
			<button
				class="py-2 px-4 border-b-2 rounded-t-md"
				class:bg-primary-500={activeTab === tab.id}
				class:text-white={activeTab === tab.id}
				class:text-gray-600={activeTab !== tab.id}
				class:hover:bg-gray-100={activeTab !== tab.id}
				class:border-transparent={activeTab !== tab.id}
				class:border-white={activeTab === tab.id}
				on:click={() => changeTab(tab.id)}
			>
				<div class="flex items-center gap-2">
					<span class="text-sm">
						{tab.label}
					</span>
					<iconify-icon icon={tab.icon} style="font-size: 15px;" />
				</div>
			</button>
		{/each}
	</div>

	<div class="p-4 w-full h-full">
		{#each tabs as tab (tab.id)}
			<div class:hidden={activeTab !== tab.id} class="w-full h-full">
				<svelte:component this={tab.component} />
			</div>
		{/each}
	</div>
</div>
