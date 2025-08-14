import { app, ipcMain } from 'electron';
import { ipcChannels } from '../config/ipc-channels';
import { SettingsType } from '../config/settings';
import { getOS } from '../utils/getOS';
import { rendererPaths } from './paths';
import { getAppMessages, getSettings, setSettings } from './store-actions';
import { is } from './util';

export default {
	initialize() {
		// This is called ONCE, don't use it for anything that changes
		ipcMain.handle(ipcChannels.GET_APP_INFO, () => {
			const os = getOS();
			return {
				name: app.getName(),
				version: app.getVersion(),
				os,
				isMac: os === 'mac',
				isWindows: os === 'windows',
				isLinux: os === 'linux',
				isDev: is.debug,
				paths: rendererPaths,
			};
		});

		// These send data back to the renderer process
		ipcMain.handle(ipcChannels.GET_RENDERER_SYNC, (id) => {
			return {
				settings: getSettings(),
				messages: getAppMessages(),
			};
		});

		ipcMain.on(
			ipcChannels.SET_SETTINGS,
			(_event, settings: Partial<SettingsType>) => {
				setSettings(settings);
			},
		);
	},
};
