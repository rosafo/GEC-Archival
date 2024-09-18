<script lang="ts" context="module">
	export interface IBreadCrumb {
		title: string;
		component?: any;
		props?: any;
		path?: string;
	}
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let options: IBreadCrumb[] = [];
	export let activeBreadCrumb = '';

	const dispatch = createEventDispatcher();
</script>

<ul class="breadcrumb flex items-center gap-2">
	{#each options as { title, path }, index}
		<li>
			<a
				on:click={() => activeBreadCrumb !== title && dispatch('click', { title, path, index })}
				href={path ?? ''}
				class="capitalize"
				class:text-primary-600={activeBreadCrumb === title}
				class:text-gray-500={activeBreadCrumb !== title}
				class:hover:text-gray-400={activeBreadCrumb !== title}
				class:cursor-text={activeBreadCrumb === title}>{title}</a
			>
		</li>
		<!-- <li><i class="bx bx-chevron-right" /></li> -->
		{#if index !== options.length - 1}
			<iconify-icon
				icon="ri:arrow-right-double-line"
				class="dark:text-gray-500"
				style="font-size:18px"
			/>
		{/if}
	{/each}
</ul>
