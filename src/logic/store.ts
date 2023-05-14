import type { Models } from 'appwrite';
import { writable } from 'svelte/store';

export type UserStoreType = {
	user: Models.User<Models.Preferences> | null;
};

export const userStore = writable<UserStoreType>({
	user: null
});
