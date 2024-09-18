<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import * as echarts from 'echarts';

	export let chartOptions: echarts.EChartsOption;
	export let eventListeners: { event: string; handler: (params?: any) => void }[] = [];
	export let height = 450;

	let chartContainer: HTMLDivElement | null = null;
	let chartInstance: echarts.ECharts | undefined;
	let resizeObserver: ResizeObserver;

	onMount(() => {
		if (chartContainer) {
			chartInstance = echarts.init(chartContainer);
			chartInstance.setOption(chartOptions);

			eventListeners.forEach(({ event, handler }) => {
				chartInstance?.on(event, handler);
			});

			resizeObserver = new ResizeObserver(() => {
				chartInstance?.resize();
			});
			resizeObserver.observe(chartContainer);
		}

		return () => {
			eventListeners.forEach(({ event, handler }) => {
				chartInstance?.off(event, handler);
			});
			chartInstance?.dispose();
			resizeObserver.disconnect();
		};
	});

	$: {
		if (chartInstance) {
			chartInstance.setOption(chartOptions);
			eventListeners.forEach(({ event, handler }) => {
				chartInstance?.off(event);
				chartInstance?.on(event, handler);
			});
		}
	}
</script>

<!-- <div bind:this={chartContainer} style="height: {height}px;" /> -->
<div bind:this={chartContainer} class="w-full h-full" />

<style>
	/* .chart {
		width: 100%;
		height: 100%;
	} */
</style>
