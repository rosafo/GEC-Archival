import { HoudiniClient } from '$houdini';
import { graphqlServerUrl, wsGraphqlServerUrl } from '$data/shared';
import { accessToken } from '$svc/auth';
import { createClient } from 'graphql-ws';
import { subscription } from '$houdini/plugins';

let token = '';
accessToken.subscribe((x) => (token = x));

export default new HoudiniClient({
	url: graphqlServerUrl,
	plugins: [
		subscription(() =>
			createClient({
				url: wsGraphqlServerUrl,
				connectionParams: () => {
					return {
						headers: {
							Authorization: token ? `Bearer ${token}` : '',
							'GraphQL-Preflight': '1'
						}
					};
				}
			})
		)
	],
	fetchParams() {
		return {
			headers: {
				Authorization: token ? `Bearer ${token}` : '',
				'GraphQL-Preflight': '1'
			}
		};
	}
});
