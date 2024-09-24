<script lang="ts" context="module">
	type FormatOptions = {
		capitalizeFirst?: boolean;
		insertSpaces?: boolean;
	};

	function formatString(input: string, options: FormatOptions = {}): string {
		let result = input;

		if (options.insertSpaces) {
			// Insert a space before all uppercase letters
			result = result.replace(/([A-Z])/g, ' $1');
		}

		if (options.capitalizeFirst) {
			// Capitalize the first letter of the entire string
			result = result.replace(/^./, (str) => str.toUpperCase());
		}

		return result.trim();
	}
	function getComponentConfigurations(name: string, type: IReportParamTypes) {
		let componentType: 'textinput' | 'datepicker' | null = null;
		let isNumberInput = false;
		switch (type) {
			case 'System.DateTime':
				componentType = IReportParamEnums['System.DateTime'];
				break;
			case 'System.Int32':
				componentType = IReportParamEnums['System.Int32'];
				isNumberInput = true;
				break;
			case 'System.Int64':
				componentType = IReportParamEnums['System.Int64'];
				isNumberInput = true;
				break;
			case 'System.Double':
				componentType = IReportParamEnums['System.Double'];
				isNumberInput = true;
				break;
			case 'System.Text':
				componentType = IReportParamEnums['System.Text'];
				break;
			default:
				break;
		}
		const newItem = {
			id: ulid(),
			type: componentType,
			props: {
				name,
				label: formatString(name, { capitalizeFirst: true, insertSpaces: true }),
				type:
					componentType === 'textinput' && isNumberInput
						? 'number'
						: componentType === 'textinput' && !isNumberInput
							? 'text'
							: null
			},
			children: []
		};
		return newItem;
	}
</script>

<script lang="ts">
	import { IReportParamEnums, type IComponent, type IReportParamTypes } from '../../cai/types';
	import { ulid } from 'ulid';
	import CaiViewEditor from './CaiViewEditor.svelte';
	import { onMount } from 'svelte';
	import _ from 'lodash';

	export let data: { name: string; type: IReportParamTypes }[] = [];
	export let formData: string | null = null;
	export let readonly = false;

	let components = [
		{
			name: 'Layout',
			icon: 'ph:stack-thin',
			items: [
				{ type: 'vstack', name: 'Vertical Stack', isContainer: true, icon: 'ph:rows' },
				{ type: 'hstack', name: 'Horizontal Stack', isContainer: true, icon: 'ph:columns' },
				{ type: 'grid', name: 'Grid', isContainer: true, icon: 'ph:grid-four' },
				{ type: 'form', name: 'Form', isContainer: true, icon: 'ph:table' }
			]
		},
		{
			name: 'Form Fields',
			icon: 'ph:table',
			items: [
				{ type: 'textinput', name: 'Text Input', isContainer: false, icon: 'ph:text-t-thin' },
				{ type: 'datepicker', name: 'Date Picker', isContainer: false, icon: 'ph:calendar' },
				{ type: 'select', name: 'Select', isContainer: false, icon: 'ph:list' }
			]
		},
		{
			name: 'Others',
			icon: 'ph:bookmarks',
			items: [{ type: 'button', name: 'Button', isContainer: false, icon: 'mdi:button' }]
		}
	];
	let definition: IComponent = {
		id: 'f1',
		type: 'form',
		props: {},
		children: []
	};

	onMount(() => {
		// const d = getComponentConfigurations('documentId', 'System.DateTime');
		if (data.length) {
			const d = data.map((x) => ({
				...getComponentConfigurations(x.name, x.type)
			}));

			definition = { ...definition, children: [...(definition.children ?? []), ...d] };
		} else if (formData) {
			const d = JSON.parse(formData);
			if (Array.isArray(d)) {
				definition = { ...definition, children: [...(definition.children ?? []), ...d] };
			} else {
				definition = { ...definition, children: [...(definition.children ?? []), d] };
			}
		}
	});
</script>

<CaiViewEditor isRoot={true} data={definition} {components} on:parsedForm {readonly} />
