<script lang="ts" context="module">
	export interface IELecectionCount {
		validVoters: number;
		invalidVoters: number;
		numberOfFiles: number;
		numberOfActivities: number;
		numberOfDevices: number;
		numberOfPollingStations: number;
	}

	interface IBarChartData {
		name: string;
		count: number;
	}

	interface ILineChartData {
		hour: string;
		successful: number;
		failed: number;
		manual: number;
	}

	export interface IElectionDashoardTypes {
		counts: IELecectionCount;
		verifications: {
			successful: IBarChartData[];
			failed: IBarChartData[];
			manual: IBarChartData[];
		};
		overTime: ILineChartData[];
	}

	function drawBarChart(data: IBarChartData[]): echarts.EChartsOption {
		return {
			tooltip: {
				trigger: 'axis',
				axisPointer: { type: 'shadow' }
			},
			legend: {
				data: data.map((x) => x.name)
			},
			xAxis: {
				type: 'category',
				data: data.map((x) => x.name)
			},
			yAxis: {
				type: 'value'
			},
			series: [
				{
					name: 'Count',
					type: 'bar',
					stack: 'total',
					barWidth: 50,
					itemStyle: {
						borderRadius: [5, 5, 0, 0],
						color: '#91CC75'
					},
					data: data.map((x) => x.count)
				}
			]
		};
	}

	function drawStackedLineChart(lineChartData: ILineChartData[]): echarts.EChartsOption {
		return {
			title: {
				text: 'Process Status (7 AM to 7 PM)'
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['Successful', 'Failed', 'Manual']
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: lineChartData.map((item) => item.hour) // Hours from 7 AM to 7 PM
			},
			yAxis: {
				type: 'value'
			},
			series: [
				{
					name: 'Successful',
					type: 'line',
					data: lineChartData.map((item) => item.successful),
					itemStyle: {
						color: '#28a745' // Green for successful
					}
				},
				{
					name: 'Failed',
					type: 'line',
					data: lineChartData.map((item) => item.failed),
					itemStyle: {
						color: '#dc3545' // Red for failed
					}
				},
				{
					name: 'Manual',
					type: 'line',
					data: lineChartData.map((item) => item.manual),
					itemStyle: {
						color: '#ffc107' // Yellow for manual
					}
				}
			]
		};
	}
</script>

<script lang="ts">
	import CountCard from '$cmps/ui/countCard.svelte';
	import Echart from '$cmps/ui/echart.svelte';
	import PageLoader from '$cmps/ui/pageLoader.svelte';
	import { showError } from '$lib/utils';
	import { readElectionDashboard } from '$svc/elections';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	export let electionId = '';

	let electionCounts = {} as IELecectionCount;
	let successfulVerification = {} as echarts.EChartsOption;
	let failedVerification = {} as echarts.EChartsOption;
	let manualVerification = {} as echarts.EChartsOption;
	let breakDown = {} as echarts.EChartsOption;

	let busy = true;

	onMount(async () => {
		try {
			const ret = await readElectionDashboard(electionId);
			if (!ret.success) {
				showError(ret.message);
				return;
			}

			const { counts, verifications, overTime } = ret.data;
			electionCounts = counts;
			successfulVerification = drawBarChart(verifications.successful);
			failedVerification = drawBarChart(verifications.failed);
			manualVerification = drawBarChart(verifications.manual);
			breakDown = drawStackedLineChart(overTime);
		} catch (error: any) {
			showError(error?.message || error);
		} finally {
			busy = false;
		}
	});
</script>

{#if busy}
	<div class="w-full h-full flex justify-center items-center"><PageLoader size={50} /></div>
{:else}
	<div class="w-full h-full flex flex-col gap-6" in:slide>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<CountCard
				label="Total Valid Voters"
				count={electionCounts.validVoters}
				icon="fluent:vote-24-filled"
				iconSize={25}
				iconClass="text-[#168e68]"
				showHover={false}
			/>

			<CountCard
				label="Total Invalid Voters"
				count={electionCounts.invalidVoters}
				icon="fluent:vote-24-filled"
				iconSize={25}
				iconClass="text-[#168e68]"
				showHover={false}
			/>
			<CountCard
				label="Total No. of Files"
				count={electionCounts.numberOfFiles}
				icon="fluent:vote-24-filled"
				iconSize={25}
				iconClass="text-[#168e68]"
				showHover={false}
			/>
			<CountCard
				label="Total No. of Activities"
				count={electionCounts.numberOfActivities}
				icon="fluent:vote-24-filled"
				iconSize={25}
				iconClass="text-[#168e68]"
				showHover={false}
			/>
			<CountCard
				label="Total No. of Devices"
				count={electionCounts.numberOfDevices}
				icon="fluent:vote-24-filled"
				iconSize={25}
				iconClass="text-[#168e68]"
				showHover={false}
			/>
			<CountCard
				label="Total No. of Polling Stations"
				count={electionCounts.numberOfPollingStations}
				icon="fluent:vote-24-filled"
				iconSize={25}
				iconClass="text-[#168e68]"
				showHover={false}
			/>
		</div>
		<div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
			<div class="space-y-4">
				<p class="text-xl text-primary-600 antialiased tracking-tighter">
					Successful Verifications
				</p>
				<div class=" bg-white p-4 rounded-[5px] loginbox h-96">
					<Echart chartOptions={successfulVerification} />
				</div>
			</div>
			<div class="space-y-4">
				<p class="text-xl text-primary-600 antialiased tracking-tighter">Failed Verifications</p>
				<div class=" bg-white p-4 rounded-[5px] loginbox h-96">
					<Echart chartOptions={failedVerification} />
				</div>
			</div>
			<div class="space-y-4">
				<p class="text-xl text-primary-600 antialiased tracking-tighter">Manual Verifications</p>
				<div class=" bg-white p-4 rounded-[5px] loginbox h-96">
					<Echart chartOptions={manualVerification} />
				</div>
			</div>
		</div>
		<div class="space-y-4 pb-4">
			<p class="text-xl text-primary-600 antialiased tracking-tighter">Verifications Over Time</p>
			<div class=" bg-white p-4 rounded-[5px] loginbox h-[500px]">
				<Echart chartOptions={breakDown} />
			</div>
		</div>
	</div>
{/if}
