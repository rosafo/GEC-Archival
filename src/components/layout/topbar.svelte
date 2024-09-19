<script lang="ts">
	import type { IUserInfo } from '$lib/types';
	import { Avatar, Button, DropdownDivider, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';

	export let user: IUserInfo | null = null;
	const dispatch = createEventDispatcher();
	let dropdownOpen = false;
</script>

<div class="py-2 flex justify-between items-center">
	<div class="flex  gap-4 items-center">
		<div>
			<img src="/ec_logo.png" alt="logo" class="w-14" />
		</div>
		<p class="text-xl font-medium tracking-tight">GEC Archival</p>
	</div>
	<div class="flex flex-grow sm:hidden" />
	<div class="flex items-center gap-4">
		<div>
			<div />
			{#if user}
				<Button pill color="light" class="!p-0 sm:!p-1 h-10  max-w-[150px]  shadow-sm border">
					<Avatar class="sm:mr-2 w-9 h-9 text-white bg-primary-500  text-sm object-cover">
						{user?.firstName.slice(0, 1)}{user?.lastName.slice(0, 1)}
					</Avatar>
					<div class="hidden sm:block text-left text-xs sm:pr-2">
						<div class="w-20 truncate">
							<span class="font-semibold">{user?.firstName}</span>
						</div>
						{#if user?.role}
							<div class="text-gray-500 truncate w-20">
								<span>{user.role}</span>
							</div>
						{:else}
							<p class="text-gray-500 truncate w-20 flex">{user?.username}</p>
						{/if}
					</div>
				</Button>
				<Dropdown bind:open={dropdownOpen}>
					<div class="px-4 py-2 space-y-2">
						<span class="block text-sm font-bold truncate">{user?.name}</span>
						<div class="block truncate text-sm">
							<span class="font-light text-gray-500">Role:</span>
							<span class="font-bold">{user?.role}</span>
						</div>
						<div class="block truncate text-sm">
							<span class="font-light text-gray-500">Username:</span>
							<span class="font-bold">{user?.username}</span>
						</div>
					</div>

					<DropdownDivider />
					<DropdownItem
						on:click={() => {
							dispatch('signout');
						}}>Sign Out</DropdownItem
					>
				</Dropdown>
			{/if}
		</div>
	</div>
</div>
