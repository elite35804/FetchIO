// DATA SHOULD ONLY FLOW DOWNWARDS
// We pass data from the main process to the renderer process using IPC
// We also use IPC to update data

// todo: add os here

import { ipcChannels } from '@/config/ipc-channels';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';

import { DEFAULT_SETTINGS, SettingsType } from '@/config/settings';
import { AppInfoType } from '@/types/app';
import { MenuItemConstructorOptions } from 'electron/renderer';
import { toast } from 'sonner';

interface GlobalContextType {
	app: Partial<AppInfoType>;
	appMenu: MenuItemConstructorOptions[];
	message: string;
	messages: string[];
	settings: SettingsType;
	setSettings: (newSettings: Partial<SettingsType>) => void;
}

export const GlobalContext = React.createContext<GlobalContextType>({
	app: {},
	appMenu: [],
	message: '',
	messages: [],
	settings: DEFAULT_SETTINGS,
	setSettings: () => {},
});

export function GlobalContextProvider({
	children,
}: {
	children?: React.ReactNode;
}) {
	const [appInfo, setAppInfo] = React.useState<Partial<AppInfoType>>({});
	const [appMenu, setAppMenu] = React.useState<MenuItemConstructorOptions[]>(
		[],
	);
	const [messages, setMessages] = React.useState<string[]>([]);

	const [settings, setCurrentSettings] =
		React.useState<SettingsType>(DEFAULT_SETTINGS);

	const [keybinds, setCurrentKeybinds] = React.useState<any>();

	useEffect(() => {
		// Create handler for receiving asynchronous messages from the main process
		const synchronizeAppState = async () => {
			console.log(ipcChannels.APP_UPDATED);

			window.electron.ipcRenderer
				.invoke(ipcChannels.GET_RENDERER_SYNC)
				.then((res) => {
					const { settings: s, keybinds: k, messages: m, appMenu: menu } = res;
					setCurrentSettings(s);
					setCurrentKeybinds(k);
					setMessages(m);
					setAppMenu(menu);
				})
				.catch(console.error);
		};

		// Listen for messages from the main process
		window.electron.ipcRenderer.on(ipcChannels.APP_UPDATED, async (data) => {
			console.log('APP_UPDATED', data);

			await synchronizeAppState();
		});

		// Get app info: name, version, paths, os - DOES NOT CHANGE
		window.electron.ipcRenderer
			.invoke(ipcChannels.GET_APP_INFO)
			.then((info) => {
				setAppInfo(info);
				return info;
			})
			.catch(console.error);

		// Request initial data when the app loads
		synchronizeAppState();

		// Let the main process know that the renderer is ready
		window.electron.ipcRenderer.send(ipcChannels.RENDERER_READY);

		return () => {
			// Clean up listeners when the component unmounts
			window.electron.ipcRenderer.removeAllListeners(ipcChannels.APP_UPDATED);
		};
	}, []);

	// Electron API functions
	const setSettings = useCallback((newSettings: Partial<SettingsType>) => {
		window.electron.setSettings(newSettings);
	}, []);

	const value = useMemo(() => {
		return {
			app: appInfo,
			appMenu,
			keybinds,
			settings,
			setSettings,
			messages,
			message: messages[0] ?? '',
		};
	}, [appInfo, appMenu, keybinds, settings, setSettings, messages]);

	return (
		<GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
	);
}

export const useGlobalContext = () => {
	const context = useContext(GlobalContext);

	if (context === undefined)
		throw new Error('useGlobalContext must be used within a GlobalContext');

	return context;
};
