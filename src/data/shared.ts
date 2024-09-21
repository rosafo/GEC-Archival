export const serverUrl = 'https://gec-archiving-api-demo.azurewebsites.net';

export const graphqlServerUrl = `${serverUrl}/graphql`;
export const wsGraphqlServerUrl = serverUrl.startsWith('https')
	? graphqlServerUrl.replace('https', 'wss')
	: graphqlServerUrl.replace('http', 'ws');
