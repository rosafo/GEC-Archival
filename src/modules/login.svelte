<script lang="ts">
	import { goto } from '$app/navigation';
	// import logo from '$assets/images/logo1.png';
	import { page } from '$app/stores';
	import { extractRedirectToRoute } from '$lib/utils';
	import { login } from '$svc/auth';

	const bgImageUrl = '/archive.jpg';
	const logo = '/ec_logo.png';

	let busy = false;
	let links: Record<
		'Facebook' | 'Instagram' | 'Twitter' | 'YouTube' | 'LinkedIn' | 'Email',
		string
	> = <any>{};
	let formData = {
		username: '',
		password: '',
		rememberMe: false
	};

	async function signIn() {
		try {
			busy = true;
			// await fetch('/login', {
			// 	method: 'POST',
			// 	body: JSON.stringify(d)
			// });
			await login(formData.username, formData.password);

			const redirect = extractRedirectToRoute($page.url.search);
			if (redirect) {
				goto(redirect);
				return;
			}
			goto('/private/home');
		} finally {
			busy = false;
		}
	}

	// onMount(async () => {
	// 	const [linkRes, contactRes] = await Promise.all([socialLinks(), readAddresses()]);
	// 	if (linkRes.success) {
	// 		links = linkRes.data.reduce((s, x) => {
	// 			s[x.type] = x.url;
	// 			return s;
	// 		}, {} as any);
	// 		if (contactRes.success) {
	// 			links['Email'] = contactRes.data.email;
	// 		}
	// 	}
	// });
</script>

<div class="h-screen w-screen overflow-y-hidden bg-white">
	<div class="flex min-h-full max-h-full overflow-y-hidden">
		<div class="flex flex-1 flex-col overflow-y-auto justify-center lg:flex-none">
			<div class="overflow-y-auto px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
				<div class="mx-auto w-full max-w-md 2xl:max-w-3xl lg:w-[500px] 2xl:w-[550px]">
					<div>
						<div class="justify-center grid">
							<div class="rounded-full border-2 p-5 border-indigo-600 shadow-md shadow-gray-400">
								<img class="w-32" src={logo} alt="Logo" loading="lazy" />
							</div>
						</div>
						<div class="text-center">
							<h2 class="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
								Sign in to your Archiving Account
							</h2>
							<!-- <p class="mt-2 text-sm leading-6 text-gray-500">
								Don't have an account?
								<a href="/signup" class="font-semibold text-indigo-600 hover:text-indigo-500"
									>Sign Up</a
								>
							</p> -->
							<!-- <a href="/joinfund" class="font-semibold text-indigo-600 hover:text-indigo-500"
							>Test fund</a
						> -->
						</div>
					</div>

					<div class="mt-10">
						<div>
							<form class="space-y-6" on:submit|preventDefault={signIn}>
								<div>
									<label for="username" class="block text-sm font-medium leading-6 text-gray-900"
										>Username</label
									>
									<div class="mt-2">
										<input
											id="username"
											name="username"
											type="username"
											autocomplete="username"
											required
											class="block px-3 w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											bind:value={formData.username}
										/>
									</div>
								</div>

								<div>
									<label for="password" class="block text-sm font-medium leading-6 text-gray-900"
										>Password</label
									>
									<div class="mt-2">
										<input
											id="password"
											name="password"
											type="password"
											autocomplete="current-password"
											required
											class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											bind:value={formData.password}
										/>
									</div>
								</div>

								<div class="flex items-center justify-between">
									<div class="flex items-center">
										<input
											id="remember-me"
											name="remember-me"
											type="checkbox"
											class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
										/>
										<label for="remember-me" class="ml-3 block text-sm leading-6 text-gray-700"
											>Remember me</label
										>
									</div>

									<div class="text-sm leading-6">
										<a href="/reset" class="font-semibold text-indigo-600 hover:text-indigo-500"
											>Forgot password?</a
										>
									</div>
								</div>

								<div>
									<button
										disabled={busy}
										type="submit"
										class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300 disabled:text-gray-400"
									>
										<div class="flex items-center gap-2">
											<span>Sign in</span>
											{#if busy}
												<iconify-icon
													icon="svg-spinners:180-ring-with-bg"
													class="text-indigo-600"
												/>
											{/if}
										</div>
									</button>
								</div>
							</form>
						</div>

						<div class="mt-10">
							<div class="relative">
								<div class="absolute inset-0 flex items-center" aria-hidden="true">
									<div class="w-full border-t border-gray-200" />
								</div>
								<!-- <div class="relative flex justify-center text-sm font-medium leading-6">
                  <span class="bg-white px-6 text-gray-900">Social</span>
                </div> -->
							</div>

							<div class="mt-6 pt-6 grid grid-cols-1 gap-4">
								<div class="flex gap-4 justify-center items-center">
									<a href={links.Facebook} target="_blank" class:hidden={!links.Facebook}>
										<iconify-icon icon="logos:facebook" width="30" />
									</a>
									<a href={links.YouTube} target="_blank" class:hidden={!links.YouTube}>
										<iconify-icon icon="logos:youtube-icon" width="30" />
									</a>
									<a href={links.Instagram} target="_blank" class:hidden={!links.Instagram}>
										<iconify-icon icon="logos:instagram-icon" width="30" />
									</a>
									<a href={links.Twitter} target="_blank" class:hidden={!links.Twitter}>
										<iconify-icon icon="tabler:brand-x" width="30" />
									</a>
									<a href={links.LinkedIn} target="_blank" class:hidden={!links.LinkedIn}>
										<iconify-icon icon="logos:linkedin-icon" width="30" />
									</a>
									<a href={links.Email} target="_blank" class:hidden={!links.Email}>
										<iconify-icon icon="ph:at" width="30" class="text-blue-500" />
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="relative hidden w-0 flex-1 lg:block">
			<img
				class="absolute inset-0 h-full w-full object-cover"
				src={bgImageUrl}
				alt=""
				loading="lazy"
			/>
		</div>
	</div>
</div>
