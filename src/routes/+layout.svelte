<script lang="ts">
	import type { Models } from 'appwrite';
	import { onMount } from 'svelte';
	import '../app.css';
	import { appWrite } from '../lib/appwrite';
	import { userStore } from '../logic/store';

	onMount(async () => {
		let user: Models.User<Models.Preferences> | null = await appWrite.account.get();

		if (!user.$id) {
			user = null;
		}

		userStore.update((store) => {
			store.user = user;
			return store;
		});
	});
</script>

<div class="h-screen overflow-hidden">
	<header class="p-4 mx-auto container flex justify-between">
		<div>
			<a class="btn btn-ghost" href="/">AppWrite playground</a>
		</div>
		<div>
			<a class="btn btn-ghost" href="/chat">Chat</a>
			<a class="btn btn-ghost" href="/profile">Profile</a>
		</div>
	</header>
	<slot />
</div>
