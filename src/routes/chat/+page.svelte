<script lang="ts">
	import { appWrite } from '$lib/appwrite';
	import { ID } from 'appwrite';
	import { onDestroy, onMount } from 'svelte';
	import { chatStore, type ChatMessage, type ChatMessagePayload } from '../../logic/store';

	const databaseID = '646102a0d63dc9a83e04';
	const collectionID = '646102a765579586e7c1';

	let contentBody: HTMLDivElement;
	let textMessageElement: HTMLTextAreaElement;

	let unsub: () => void = () => {};

	onMount(() => {
		autoResizeInput(textMessageElement);
		textMessageElement.addEventListener('input', (e) => {
			if (e.currentTarget) {
				autoResizeInput(e.currentTarget as HTMLElement);
			}
		});
		textMessageElement.style.minHeight = `${textMessageElement.scrollHeight}px`;
		textMessageElement.style.maxHeight = `${textMessageElement.scrollHeight * 5}px`;

		unsub = appWrite.client.subscribe<ChatMessagePayload>(
			'databases.646102a0d63dc9a83e04.collections.646102a765579586e7c1.documents',
			(e) => {
				const message: ChatMessage = {
					id: e.payload.$id,
					author: e.payload.author,
					content: e.payload.content
				};
				chatStore.update((store) => {
					store.messages.push(message);
					return store;
				});
			}
		);
		window.onresize = adjustContentBodyHeight;
		adjustContentBodyHeight();
	});

	function adjustContentBodyHeight() {
		const header = document.querySelector('header')!;
		const headerHeight = Number(getComputedStyle(header).height.replace('px', ''));
		const screenHeight = window.innerHeight;

		contentBody.style.height = `${screenHeight - headerHeight}px`;
	}

	function autoResizeInput(el: HTMLElement) {
		el.style.height = 'auto';
		el.style.height = `${el.scrollHeight}px`;
	}

	function sendMessage() {
		const msg = textMessageElement.value ?? '';
		if (msg.trim() === '') {
			return;
		}

		appWrite.databases.createDocument(databaseID, collectionID, ID.unique(), {
			author: 'me',
			content: msg
		});
		textMessageElement.value = '';
	}

	onDestroy(() => {
		unsub();
	});
</script>

<div class="flex flex-col overflow-hidden" bind:this={contentBody}>
	<div class="container mx-auto h-full overflow-hidden flex flex-col p-4">
		<div class="flex flex-col">
			<h1 class="text-3xl">Chat</h1>
			<h1 class="text-xl">Have fun!</h1>
		</div>
		<div
			class="flex flex-col-reverse flex-1 border rounded-xl p-4 border-base-content m-10 overflow-y-auto"
		>
			{#each $chatStore.messages.reverse() as msg}
				<div class="chat chat-start">
					<div class="chat-header">
						{msg.author}
						<time class="text-xs opacity-50">2 hours ago</time>
					</div>
					<div class="chat-bubble whitespace-pre">{msg.content}</div>
					<div class="chat-footer opacity-50">Seen</div>
				</div>
			{/each}
		</div>
		<div class="flex items-end gap-2">
			<textarea
				autofocus
				class="textarea textarea-bordered flex-1 overflow-hidden"
				on:keydown={(e) => {
					if (e.ctrlKey && e.key === 'Enter') {
						sendMessage();
					}
				}}
				rows="1"
				bind:this={textMessageElement}
			/>
			<button class="btn btn-primary" on:click={sendMessage}>Send</button>
		</div>
	</div>
</div>
