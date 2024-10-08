<script lang="ts" context="module">
	export interface IElectionToPlot {
		name: string;
		date: Date; // in case we want to sort since the name may not be sequential
		males: number;
		females: number;
	}

	function electionsToPlot(data: IElectionToPlot[]): echarts.EChartsOption {
		const names = data.map((data) => data.name);
		const maleCounts = data.map((data) => data.males);
		const femaleCounts = data.map((data) => data.females);

		return {
			tooltip: {
				trigger: 'axis',
				axisPointer: { type: 'shadow' }
			},
			legend: {
				data: ['Male', 'Female']
			},
			xAxis: {
				type: 'category',
				data: names
			},
			yAxis: {
				type: 'value'
			},
			series: [
				{
					name: 'Male',
					type: 'bar',
					stack: 'total',
					// barWidth: 30,
					// itemStyle: {
					// 	borderRadius: [5, 5, 0, 0],
					// 	color: '#5470C6'
					// },
					data: maleCounts
				},
				{
					name: 'Female',
					type: 'bar',
					stack: 'total',
					barWidth: 30,
					itemStyle: {
						borderRadius: [5, 5, 0, 0],
						color: '#91CC75'
					},
					data: femaleCounts
				}
			]
		};
	}
</script>

<script lang="ts">
	import { getMonthName, showError } from '$lib/utils';
	import { readElectionGraph, readElections, type IElection } from '$svc/elections';
	import { onMount } from 'svelte';
	import { Modal } from 'flowbite-svelte';
	import Editor from './editor.svelte';
	import Echart from '$cmps/ui/echart.svelte';
	import PageLoader from '$cmps/ui/pageLoader.svelte';
	import { userInfo } from '$svc/auth';
	import dayjs from 'dayjs';

	interface IElectionToShow extends IElection {
		isFirst?: boolean;
		isLast?: boolean;
	}

	let electionsData: IElection[] = [];
	let displayedElections: IElectionToShow[] = [];
	let startIndex = 1;
	let hasMoreProjects = true;
	let isLoadingProjects = true;
	let openForm = false;
	let electionBrokeDown = {} as echarts.EChartsOption;
	let isLoadingChart = true;
	$: canAddElection = $userInfo?.permissions.includes('CanAddElection');
	$: incrementCount = canAddElection ? 3 : 4;

	async function loadElections(page: number, take: number) {
		try {
			if (!isLoadingProjects) isLoadingProjects = true;
			const ret = await readElections(page, take);
			if (!ret.success) {
				showError(ret.message);
				return;
			}
			if (ret.data.items?.length) {
				const newData = ret.data.items;

				const filteredNewData = newData.filter(
					(newItem) => !electionsData.some((existingItem) => existingItem.id === newItem.id)
				);

				electionsData = [...electionsData, ...filteredNewData];

				loadInitialElectionEntries();
				hasMoreProjects = ret.data.pageInfo.hasNextPage;
			}
		} catch (error: any) {
			showError(error?.message || error);
		} finally {
			isLoadingProjects = false;
		}
	}

	function loadInitialElectionEntries() {
		electionsData.sort((a, b) => b.startDate.getTime() - a.endDate.getTime());

		displayedElections = [
			{
				isFirst: true,
				id: Math.floor(1000 + Math.random() * 9000),
				name: 'Add Election'
			} as IElectionToShow,
			...electionsData.map((x) => ({ ...x, isLast: false, isFirst: false })),
			{
				isLast: true,
				id: Math.floor(1000 + Math.random() * 9000),
				name: 'Get More Elections'
			} as IElectionToShow
		];

		if (!canAddElection) {
			displayedElections = displayedElections.filter(
				(x) => !(x.isFirst && x.name === 'Add Election')
			);
		}
	}

	function loadMoreEntries() {
		if (!hasMoreProjects) return;
		startIndex++;
		loadElections(startIndex, incrementCount);
	}

	function handleClose() {
		openForm = false;
		startIndex = 1;
		electionsData = [];
		displayedElections = [];
		loadElections(startIndex, incrementCount);
	}

	onMount(async () => {
		loadElections(startIndex, incrementCount);
		try {
			const ret = await readElectionGraph();
			if (!ret?.success) {
				showError(ret?.message || '');
			} else {
				if (ret.data.result) {
					const d = ret.data.result?.map((c) => ({
						date: c?.date as Date,
						females: c?.females || 0,
						males: c?.males || 0,
						name: c?.name || ''
					})) as IElectionToPlot[];
					electionBrokeDown = electionsToPlot(d);
				}
			}
		} catch (error: any) {
			showError(error?.message || error);
		} finally {
			isLoadingChart = false;
		}
	});
</script>

<div class="w-full h-full flex flex-col gap-7">
	<div class="flex flex-col gap-4">
		<div class="flex flex-col">
			<p class="text-xl text-primary-600 antialiased tracking-tighter">Elections</p>
			<p class="text-sm">
				Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius illum nobis eveniet dolorem,
				cumque ratione nam soluta in voluptatibus esse impedit error enim inventore? Minus error ea
				eum tempore ullam.
			</p>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
			{#if isLoadingProjects}
				{#each Array(6) as _}
					<div class="h-[82px] animate-pulse bg-gray-300 w-full rounded-md"></div>
				{/each}
			{:else}
				{#each displayedElections as project}
					{#if project.isFirst}
						<button
							on:click={() => (openForm = true)}
							class="border h-[82px] border-dashed border-gray-500 rounded-md flex items-center gap-2 justify-center hover:border-gray-900"
						>
							<div class="flex flex-col gap-2 items-center">
								<div class="flex items-center gap-2">
									<iconify-icon icon="cib:addthis" style="font-size: 23px;" class="text-blue-600" />
									<span> Add New Election </span>
								</div>
								<span class="text-gray-500 text-sm"
									>Lorem, ipsum dolor sit amet consectetur adipisicing elit</span
								>
							</div>
						</button>
					{:else if project.isLast}
						<button
							class="border h-[82px] loginbox bg-white border-transparent hover:border-primary-400 rounded-md flex items-center gap-2 justify-center disabled:bg-gray-100 disabled:hover:border-transparent"
							on:click={loadMoreEntries}
							disabled={!hasMoreProjects}
						>
							<div class="flex flex-col gap-2 items-center">
								<div class="flex items-center gap-2">
									<iconify-icon
										icon="f7:table-badge-more-fill"
										style="font-size: 23px;"
										class="text-blue-600"
									/>
									<span> Load More Elections </span>
								</div>
								<span class="text-gray-500/70 text-sm"
									>Lorem, ipsum dolor sit amet consectetur adipisicing elit</span
								>
							</div>
						</button>
					{:else}
						<a
							href={`/private/home/${project.id}`}
							class="flex loginbox gap-4 px-4 items-center bg-white h-[82px] rounded-[5px] border border-transparent hover:border-primary-400"
						>
							<div class="bg-primary-500 grid place-content-center rounded-[5px] p-2">
								<iconify-icon icon="gg:overflow" style="font-size: 28px;" class="text-white" />
							</div>
							<div>
								<div class="flex items-center gap-1">
									<span class="">{project.name}</span>
									<span class="text-gray-500 tracking-tighter antialiased text-xs"
										>({project.electionType})</span
									>
									<iconify-icon icon="fluent:arrow-right-24-filled" />
								</div>
								<p class="text-gray-500 text-start text-sm">
									{`${dayjs(project.startDate).format('DD-MMM-YYYY')} to ${dayjs(project.endDate).format('DD-MMM-YYYY')}`}
								</p>
							</div>
						</a>
					{/if}
				{/each}
			{/if}
		</div>
	</div>
	<div class="space-y-4 pb-4">
		<p class="text-xl text-primary-600 antialiased tracking-tighter">Breakdown</p>
		<div class=" bg-white p-4 rounded-[5px] loginbox h-[530px]">
			{#if isLoadingChart}
				<div class="w-full h-full">
					<PageLoader size={50} />
				</div>
			{:else}
				<Echart chartOptions={electionBrokeDown} />
			{/if}
		</div>
	</div>
</div>

<Modal bind:open={openForm} title="New Election">
	<Editor on:close={handleClose} />
</Modal>
