<script lang="ts" context="module">
	export interface IElectionToPlot {
		year: number;
		males: number;
		females: number;
	}

	function electionsToPlot(data: IElectionToPlot[]): echarts.EChartsOption {
		const years = data.map((data) => data.year.toString());
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
				data: years
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

	interface IElectionToShow extends IElection {
		isFirst?: boolean;
		isLast?: boolean;
	}

	let electionsData: IElection[] = [];
	let displayedElections: IElectionToShow[] = [];
	let startIndex = 0;
	const incrementCount = 4;
	let hasMoreProjects = true;
	let isLoadingProjects = true;
	let openForm = false;
	let electionBrokeDown = {} as echarts.EChartsOption;
	let isLoadingChart = true;

	async function loadElections() {
		try {
			if (!isLoadingProjects) isLoadingProjects = true;
			const ret = await readElections();
			if (!ret.success) {
				showError(ret.message);
				return;
			}
			if (ret.data.length) {
				electionsData = ret.data;
				loadInitialElectionEntries();
			}
		} catch (error: any) {
			showError(error?.message || error);
		} finally {
			isLoadingProjects = false;
		}
	}

	function loadInitialElectionEntries() {
		electionsData.sort((a, b) => b.year - a.year);
		displayedElections = [
			{
				isFirst: true,
				id: '',
				name: 'Add Election'
			} as IElectionToShow,
			...electionsData.slice(startIndex, startIndex + incrementCount),
			{
				isLast: true,
				id: '1000',
				name: 'Get More Elections'
			} as IElectionToShow
		];
		startIndex += incrementCount;
		hasMoreProjects = startIndex < electionsData.length;
	}

	function loadMoreEntries() {
		if (!hasMoreProjects) return;

		const moreProjects = electionsData.slice(startIndex, startIndex + incrementCount);
		displayedElections = [
			...displayedElections.slice(0, -1),
			...moreProjects,
			{
				isLast: true,
				id: '10000',
				name: 'Get More Elections'
			} as IElectionToShow
		];
		startIndex += incrementCount;
		hasMoreProjects = startIndex < electionsData.length;
	}

	function handleClose() {
		openForm = false;
		startIndex = 0;
		electionsData = [];
		displayedElections = [];
		loadElections();
	}

	onMount(async () => {
		loadElections();
		try {
			const ret = await readElectionGraph();
			if (ret.message) {
				showError(ret.message);
			} else {
				electionBrokeDown = electionsToPlot(ret.data);
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
									<iconify-icon icon="fluent:arrow-right-24-filled" />
								</div>
								<p class="text-gray-500 text-start text-sm">
									{`${getMonthName(project.month)} ${project.year}`}
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
