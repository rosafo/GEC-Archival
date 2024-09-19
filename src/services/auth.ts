import { writable } from 'svelte/store';
import type { IUserInfo } from '../features/auth/types';

export const userInfo = writable<IUserInfo | null>();
