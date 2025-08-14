import { $errors } from '@/config/strings';
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { getOS } from '@/utils/getOS';
import { ipcChannels } from '../config/ipc-channels';
import { SettingsType } from '../config/settings';

const channels = Object.values(ipcChannels);

const electronHandler = {
	os: getOS(),
	setSettings: (settings: Partial<SettingsType>) =>
		ipcRenderer.send(ipcChannels.SET_SETTINGS, settings),
	ipcRenderer: {
		invoke(channel: string, ...args: unknown[]) {
			if (!channels.includes(channel)) {
				throw new Error(`${$errors.invalidChannel}: ${channel}`);
			}
			return ipcRenderer.invoke(channel, ...args);
		},
		send(channel: string, ...args: unknown[]) {
			if (!channels.includes(channel)) {
				return;
			}
			return ipcRenderer.send(channel, ...args);
		},
		on(channel: string, func: (...args: unknown[]) => void) {
			if (!channels.includes(channel)) {
				return;
			}
			const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
				func(...args);
			ipcRenderer.on(channel, subscription);

			return () => {
				ipcRenderer.removeListener(channel, subscription);
			};
		},
		once(channel: string, func: (...args: unknown[]) => void) {
			if (!channels.includes(channel)) {
				return;
			}
			ipcRenderer.once(channel, (_event, ...args) => func(...args));
		},
		removeAllListeners(channel: string) {
			ipcRenderer.removeAllListeners(channel);
		},
	},
	onAuthSuccess: (callback: any) => ipcRenderer.on('auth-success', callback),
	onAuthError: (callback: any) => ipcRenderer.on('auth-error', callback),
	saveToJson: (data: any, type: string) =>
		ipcRenderer.invoke('save-to-json', data, type),
	readJson: (type: string) => ipcRenderer.invoke('read-json', type),
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
