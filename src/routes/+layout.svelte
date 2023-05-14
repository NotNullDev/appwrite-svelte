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

<div>
	<header class="p-4 mx-auto container">
		<a class="btn btn-ghost" href="/">AppWrite playground</a>
	</header>
	<slot />
</div>
