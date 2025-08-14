import { app, BrowserWindow } from 'electron';
import Logger from 'electron-log';
import { APP_MESSAGES_MAX } from '../config/config';
import { ipcChannels } from '../config/ipc-channels';
import { SettingsType } from '../config/settings';
import { $messages } from '../config/strings';
import store, { AppMessageType } from './store';
import windows from './windows';

const synchronizeApp = (changedSettings?: Partial<SettingsType>) => {
	// Sync with main
	if (changedSettings) {
		const keys = Object.keys(changedSettings);

		if (keys.includes('accentColor') || keys.includes('theme')) {
			const mainWindow = windows.mainWindow as BrowserWindow | null;
			if (
				mainWindow &&
				!mainWindow.isDestroyed() &&
				typeof mainWindow.setTitleBarOverlay === 'function'
			) {
				mainWindow.setTitleBarOverlay({
					color: changedSettings.theme === 'dark' ? '#020817' : '#ffffff',
					symbolColor: changedSettings.accentColor || '#000000',
				});
			}
		}
	}
};

export const resetStore = () => {
	Logger.status($messages.resetStore);
	store.clear();

	synchronizeApp();
};

export const getSetting = (setting: keyof SettingsType) => {
	const settings = store.get('settings');
	if (settings[setting] !== undefined) {
		return settings[setting];
	}
};

export const getSettings = () => {
	return store.get('settings');
};

export const setSettings = (settings: Partial<SettingsType>) => {
	store.set('settings', {
		...getSettings(),
		...settings,
	});

	// Sync with renderer
	synchronizeApp(settings);
};

export const getAppMessages = () => {
	const messages = store.get('appMessageLog');

	// Reverse the messages so that the most recent is at the top
	const reversed = messages.slice().reverse();
	return reversed;
};
