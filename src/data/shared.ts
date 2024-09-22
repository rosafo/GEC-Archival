export const serverUrl = import.meta.env.VITE_APISERVERURL

export const graphqlServerUrl = `${serverUrl}/graphql`;
export const wsGraphqlServerUrl = serverUrl.startsWith('https')
	? graphqlServerUrl.replace('https', 'wss')
	: graphqlServerUrl.replace('http', 'ws');
