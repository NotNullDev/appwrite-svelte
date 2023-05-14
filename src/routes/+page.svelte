<script lang="ts">
	import type { Models } from 'appwrite';
	import { onMount } from 'svelte';
	import { appWrite } from '../lib/appwrite';
	import { userStore } from '../logic/store';

	let files: Models.FileList | null;
	let filesToUploadRaw: FileList | null;
	let filesToUpload: File[];

	const bucketID = '6460ede15bef2ad7e490';

	onMount(async () => {
		files = await appWrite.storage.listFiles(bucketID);
	});

	async function loginWithGithub() {
		appWrite.account.createOAuth2Session(
			'github',
			'http://localhost:5173',
			'http://localhost:5173/error'
		);
	}

	async function logout() {
		const currentSession = await appWrite.account.getSession('current');

		await appWrite.account.deleteSession(currentSession.$id);
		userStore.update((store) => {
			store.user = null;
			return store;
		});
	}

	async function uploadFiles() {
		for (const f of filesToUpload) {
			appWrite.storage.createFile(bucketID, '', f).then(console.log).catch(console.error);
		}
		filesToUploadRaw = null;
	}

	$: {
		if (filesToUploadRaw) {
			filesToUpload = [];
			for (const f of filesToUploadRaw) {
				filesToUpload.push(f);
			}
			filesToUpload = filesToUpload;
		}
	}
</script>

<div class="container mx-auto pt-10 h-full overflow-y-auto flex flex-col">
	<h1 class="text-2xl">Lets discover the power of AppWrite</h1>

	<section class="mt-10 ml-5">
		<h2 class="text-xl mb-3">Authentication</h2>
		<div class="ml-2">
			{#if $userStore.user}
				<div>Hello, {$userStore.user.email}</div>
				<button class="btn btn-secondary" on:click={logout}>Logout</button>
			{:else}
				<h2 class="text-xl">Login</h2>
				<button on:click={loginWithGithub} class="btn btn-ghost">Login with Github</button>
			{/if}
		</div>
	</section>

	<section class="mt-10 ml-5 flex flex-col flex-1">
		<h2 class="text-xl mb-3">Files</h2>
		<input type="file" multiple bind:files={filesToUploadRaw} />
		<button class="btn btn-secondary" on:click={uploadFiles}>Upload</button>
		<div class="ml-2">
			{#if files}
				{#each files.files as file}
					<div class="p-4 bg-base-200 rounded-xl">
						{file.name}
						<img src={appWrite.storage.getFileView(bucketID, file.$id).href} alt={file.name} />
					</div>
				{/each}
			{/if}
		</div>
	</section>
</div>
