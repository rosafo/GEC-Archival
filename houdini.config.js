/** @type {import("houdini").ConfigFile} */
export default {
	static: true,
	defaultCachePolicy: 'NetworkOnly',
	watchSchema: {
		url2: 'https://gec-archiving-api-demo.azurewebsites.net/graphql/',
		url: 'http://localhost:5239/graphql/'
	},
	plugins: {
		'houdini-svelte': {
			static: true
		}
	},
	scalars: {
		UUID: {
			type: 'string'
		},
		Long: {
			type: 'number'
		},
		Decimal: {
			type: 'number'
		},
		DateTime: {
			type: 'Date',
			unmarshal(value) {
				return value ? new Date(value) : null;
			},
			marshal(date) {
				return date && date.toISOString();
			}
		},
		Date: {
			type: 'Date',
			unmarshal(value) {
				return value ? new Date(value) : null;
			},
			marshal(date) {
				return date && date.toISOString().slice(0, 10);
			}
		},
		TimeSpan: {
			type: 'any'
		},
		Upload: {
			type: 'File'
		},
		JSON: {
			type: 'any'
		}
	}
};
