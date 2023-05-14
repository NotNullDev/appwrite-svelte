import type { Models } from 'appwrite';
import { writable } from 'svelte/store';

export type UserStoreType = {
	user: Models.User<Models.Preferences> | null;
};

export const userStore = writable<UserStoreType>({
	user: null
});

export type ChatMessagePayload = {
	author: string;
	content: string;
	$id: string;
};

export type ChatMessage = {
	author: string;
	content: string;
	id: string;
};

export type ChatStoreType = {
	messages: ChatMessage[];
};

export const chatStore = writable<ChatStoreType>({
	messages: []
});
