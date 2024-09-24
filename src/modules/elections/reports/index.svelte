<script lang="ts" context="module">
	export interface IReportType {
		category: string;
		description: string;
		items: {
			title: string;
			description: string;
			icon: string;
		}[];
	}
</script>

<script lang="ts">
	import ActionButton from '$cmps/ui/actionButton.svelte';
	import PageLoader from '$cmps/ui/pageLoader.svelte';
	import { showError } from '$lib/utils';
	import { myReports } from '$svc/admin';
	import { readReports } from '$svc/reports';
	import { createEventDispatcher, onMount } from 'svelte';
	import { scale } from 'svelte/transition';
	const dispatch = createEventDispatcher();

	let reports: IReportType[] = [];
	let busy = true;

	onMount(async () => {
		try {
			const ret = await myReports();
			if (!ret.success) {
				showError(ret.message);
				return true;
			}
			const reportList = ret.data
				.map((x) => {
					return {
						...x,
						title: x.name,
						icon: '',
						filterForm: x.filterForm ? JSON.parse(x.filterForm) : {}
					};
				})
				.reduce((state, x) => {
					if (!x.category) return state;
					if (!state[x.category])
						state[x.category] = {
							category: x.category,
							description: '',
							items: []
						};
					state[x.category].items.push({
						title: x.name,
						description: x.description,
						icon: '',
						id: x.id,
						filterForm: x.filterForm
					});
					return state;
				}, {});
			reports = Object.values(reportList); // todo: sort by the name of category
		} catch (error: any) {
			showError(error.message || error);
		} finally {
			busy = false;
		}
	});
</script>

{#if busy}
	<div class="w-full h-full"><PageLoader size={50} /></div>
{:else if reports.length > 0}
	<div class="w-full h-full" in:scale>
		<div>
			<div class="flex flex-col gap-5">
				{#each reports as card}
					<div class="space-y-3">
						<div class="border-b border-gray-300 text-teal-500 text-lg">{card.category}</div>
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 px-1">
							{#if card?.items && card.items.length}
								{#each card?.items as item (item.title)}
									<ActionButton
										label={item.title}
										subLabel={item.description}
										showArrow
										icon={item.icon || 'mdi:report-bar'}
										iconBgColor={'bg-primary-500'}
										iconColor={'text-white'}
										showIconHover={false}
										moreHeight={false}
										iconSize={20}
										moreShadow
										on:click={() => dispatch('addTab', item)}
									/>
								{/each}
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{:else}
	<div class="w-full h-full grid justify-center items-center" in:scale>
		<div class="bg-yellow-300 rounded-[5px] py-5 px-10 text-center">
			No Report has been added to your role. <br /> Please contact your Administrator.
		</div>
	</div>
{/if}
