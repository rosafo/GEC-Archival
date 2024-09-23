<script lang="ts" context="module">
	export const COMPONENTFIELDS = {
		textinput: [
			{ type: 'text', label: 'Label', name: 'label', default: '' },
			{ type: 'text', label: 'Name', name: 'name', default: '' },
			{ type: 'text', label: 'Placeholder', name: 'placeholder', default: '' },
			{ type: 'text', label: 'Classes', name: 'otherClasses', default: '' },
			{ type: 'text', label: 'Type', name: 'type', default: 'text' },
			{ type: 'text', label: 'Pattern', name: 'pattern', default: '' },
			{ type: 'checkbox', label: 'Required', name: 'required', default: false },
			{ type: 'checkbox', label: 'Read Only', name: 'readonly', default: false }
		],
		datepicker: [
			{ type: 'text', label: 'Label', name: 'label', default: '' },
			{ type: 'text', label: 'Name', name: 'name', default: '' },
			{ type: 'text', label: 'Placeholder', name: 'placeholder', default: '' },
			{ type: 'text', label: 'Date Format', name: 'dateFormat', default: 'Y-m-d' },
			{ type: 'text', label: 'Alt Format', name: 'pattern', default: 'Y-m-d' },
			{ type: 'checkbox', label: 'Required', name: 'required', default: false },
			{ type: 'checkbox', label: 'Read Only', name: 'readonly', default: false },
			{ type: 'checkbox', label: 'Enable Time', name: 'enableTime', default: false },
			{ type: 'checkbox', label: 'No Calendar', name: 'noCalendar', default: false },
			{ type: 'checkbox', label: 'Alt Input', name: 'altInput', default: true },
			{ type: 'checkbox', label: 'Week Numbers', name: 'weekNumbers', default: false },
			{
				type: 'list',
				label: 'Mode',
				name: 'mode',
				default: 'single',
				options: ['single', 'multiple', 'range']
			}
		],
		rest: [{ type: 'text', label: 'Classes', name: 'classes', default: '' }]
	};
</script>

<script lang="ts">
	import type { IComponent, IComponentChild, IParsedComponent } from '$cai/types';
	import { parseComponent } from '$cai/ComponentStore.svelte';
	import ComponentEditor from './ComponentEditor.svelte';
	import ComponentRenderer from '$cai/ComponentRenderer.svelte';
	import ComponentList from './ComponentList.svelte';
	import PropertyEditor from './PropertyEditor.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import { initCai } from '$cai/index.svelte';
	import { ulid } from 'ulid';

	export let data: IComponent;
	export let components: any[];
	export let readonly = false

	function getComponentConfig(config) {
		if (config == null) return {};
		return {
			fields: COMPONENTFIELDS[config.type] ?? COMPONENTFIELDS.rest
		};
	}

	function getComponentProps(config) {
		if (config == null) return {};
		return config.props;
	}

	let selectedItem;
	let renderId = 0;
	let renderList = 0;
	const dispatch = createEventDispatcher();
	$: componentConfig = getComponentConfig(selectedItem);
	$: componentProps = getComponentProps(selectedItem);
	let state = {};
	let parsedForm: IParsedComponent;
	$: {
		try {
			const p = parseComponent(data);
			parsedForm = p;
			dispatch('parsedForm', parsedForm);
		} catch (e) {
			console.log({ e }); // todo: remove
		}
	}

	onMount(async () => {
		initCai();
		// todo: create a container element if no data is provided
		parsedForm = parseComponent(data);
	});

	function addComponent({ detail }: any) {
		// console.log('adding', detail, ' to ', selectedItem);
		const newItem = { id: ulid(), type: detail.type, props: {}, children: [] };
		if (selectedItem) {
			if (selectedItem?.type === 'textinput') {
				return true;
			}
			selectedItem.children.push(newItem);
		} else {
			if (!data.children) data.children = [];
			data.children.push(newItem);
		}
		// parsedForm = parseComponent(data)
		data = data;
	}

	let showSidebar = false;

	function toggleSidebar() {
		showSidebar = !showSidebar;
	}

	$: if (componentProps) {
		renderId++;
	}

	onMount(() => {
		renderList++;
	});
</script>

<div class="w-full h-full overflow-hidden">
	<div class="flex overflow-hidden w-full h-full relative">
		<div class="flex-grow">
			<div class="w-full h-full">
				<div class="hidden">Preview</div>
				{#if selectedItem}
					<PropertyEditor bind:value={selectedItem.props} config={componentConfig} />
				{/if}
				<div class="overflow-y-auto h-full bg-gray-100">
					<div class="m-4 p-4 bg-white border border-solid shadow-lg">
						{#if parsedForm}
							{#key renderId}
								<ComponentRenderer defn={parsedForm} bind:state props={componentProps} />
							{/key}
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div class="min-w-52 md:min-w-96 overflow-y-auto" class:hidden={readonly}>
			{#key renderList}
				<ComponentEditor bind:node={data} bind:selectedItem />
			{/key}
		</div>
		<div class="relative flex flex-col" class:hidden={readonly}>
			<button class="px-2 pt-1 right-4 md:hidden" on:click={toggleSidebar}>
				<iconify-icon icon="ic:round-menu" class="border p-1" />
			</button>

			<div
				class={`absolute md:static right-0 top-8 h-full ${showSidebar ? '' : 'hidden md:block'}`}
			>
				<div class="min-w-64 overflow-y-auto bg-white h-full pt-1">
					<ComponentList {components} on:click={addComponent} />
				</div>
			</div>
		</div>
		<!-- <div class="">
			{JSON.stringify(selectedItem?.props, null, 2)}
			<hr />
			{JSON.stringify(state, null, 2)}
		</div> -->
	</div>
</div>
