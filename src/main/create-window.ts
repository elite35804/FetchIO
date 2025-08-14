/* eslint-disable no-param-reassign */
import {
	BrowserWindow,
	BrowserWindowConstructorOptions,
	app,
	shell,
	ipcMain,
} from 'electron';
import Logger from 'electron-log/main';
import express from 'express';
import DiscordOauth2 from 'discord-oauth2';
import path from 'path';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from '../renderer/config';

import { APP_FRAME, APP_HEIGHT, APP_WIDTH } from '../config/config';
import { setupContextMenu } from './context-menu';
import { __assets } from './paths';
import { getSetting } from './store-actions';
import { is, resolveHtmlPath } from './util';

const fs = require('fs').promises;
const os = require('os');

const oauth = new DiscordOauth2({
	clientId: CLIENT_ID, // Replace with your Discord Client ID
	clientSecret: CLIENT_SECRET, // Replace with your Discord Client Secret
	redirectUri: REDIRECT_URI,
});

let browserWindow: BrowserWindow | null;
const getAssetPath = (...paths: string[]): string => {
	return path.join(__assets, ...paths);
};

const expressApp = express();
expressApp.get('/auth', async (req, res) => {
	const code = req.query.code as string;
	if (!code) {
		res.status(400).send('No code provided');
		return;
	}

	try {
		const tokenData = await oauth.tokenRequest({
			code,
			scope: 'identify',
			grantType: 'authorization_code',
		});
		browserWindow?.webContents.send('auth-success', tokenData);
		res.send('Authentication successful! You can close this window.');
	} catch (error) {
		browserWindow?.webContents.send('auth-error', error);
		res.status(500).send('Authentication failed');
	}
});

const createWindow = (opts?: BrowserWindowConstructorOptions) => {
	const options: BrowserWindowConstructorOptions = {
		title: app.name,
		tabbingIdentifier: app.name,
		frame: APP_FRAME,
		show: false,

		backgroundColor: '#00000000', // transparent hexadecimal or anything with transparency,
		vibrancy: 'under-window', // appearance-based, titlebar, selection, menu, popover, sidebar, header, sheet, window, hud, fullscreen-ui, tooltip, content, under-window, or under-page.
		useContentSize: true, // The width and height would be used as web page's size, which means the actual window's size will include window frame's size and be slightly larger. Default is false.

		width: APP_WIDTH,
		minWidth: 550,
		height: APP_HEIGHT,
		minHeight: 420,
		...(is.linux ? { icon: getAssetPath('icon.png') } : {}),
		...opts,
	};

	options.webPreferences = {
		disableBlinkFeatures: 'Auxclick',
		preload: app.isPackaged
			? path.join(__dirname, 'preload.js')
			: path.join(__dirname, '../../.erb/dll/preload.js'),
		nodeIntegration: false,
		contextIsolation: true,
		// Todo: secure
	};

	browserWindow = new BrowserWindow(options);

	browserWindow.webContents.on('did-fail-load', (event: any) => {
		Logger.error(`Window failed load: ${event?.sender}`);
	});

	browserWindow.webContents.on('did-finish-load', () => {
		Logger.info('Window finished load');
	});

	// Clean
	browserWindow.on('closed', () => {
		Logger.status('Window closed');
	});

	// Open urls in the user's browser
	browserWindow.webContents.setWindowOpenHandler((data) => {
		shell.openExternal(data.url);
		return { action: 'deny' };
	});

	// Context menu
	setupContextMenu(browserWindow);

	return browserWindow;
};

export const createMainWindow = async () => {
	const options: BrowserWindowConstructorOptions = {
		// acceptFirstMouse: true, // macOS: Whether clicking an inactive window will also click through to the web contents. Default is false
		// alwaysOnTop: true,
		show: false,
		// skipTaskbar: true, // Whether to show the window in taskbar. Default is false.
		titleBarStyle: 'hidden', // 'default', 'hidden', 'hiddenInset', 'customButtonsOnHover
		// titleBarOverlay: true, // https://developer.mozilla.org/en-US/docs/Web/API/Window_Controls_Overlay_API
		trafficLightPosition: { x: 10, y: 9 },

		transparent: false, // Makes the window transparent. Default is false. On Windows, does not work unless the window is frameless.
		// backgroundColor: '#00000000', // transparent hexadecimal or anything with transparency,
		vibrancy: 'under-window', // appearance-based, titlebar, selection, menu, popover, sidebar, header, sheet, window, hud, fullscreen-ui, tooltip, content, under-window, or under-page.

		width: APP_WIDTH,
		minWidth: 550,
		height: APP_HEIGHT,
		minHeight: 420,
		resizable: true,
		frame: false,
	};

	if (is.windows) {
		options.titleBarOverlay = {
			color: getSetting('theme') === 'dark' ? '#000000' : '#171520',
			symbolColor: 'white',
			height: 34,
		};
	}

	const window = createWindow(options);
	window.loadURL('http://localhost:3000');
	expressApp.listen(3000, () =>
		console.log('Express server running on port 3000'),
	);
	window.on('ready-to-show', () => {
		// Setting: Start minimized
		if (process.env.START_MINIMIZED || getSetting('startMinimized')) {
			window.minimize();
		} else {
			window.show();
		}
	});

	// Load the window
	window.loadURL(resolveHtmlPath('index.html'));

	return window;
};

ipcMain.handle('read-json', async (event, type) => {
	try {
		const filePath = path.join(os.homedir(), `fetch_${type}.json`);
		const data = await fs.readFile(filePath, 'utf-8');
		return JSON.parse(data);
	} catch (error: any) {
		if (error.code === 'ENOENT') {
			return null; // File doesn't exist
		}
		throw new Error(`Failed to read JSON: ${error.message}`);
	}
});

ipcMain.handle('save-to-json', async (event, data, type) => {
	try {
		const filePath = path.join(os.homedir(), `fetch_${type}.json`);
		await fs.writeFile(filePath, JSON.stringify(data, null, 2));
		return `Successfully saved to ${filePath}`;
	} catch (error) {
		throw new Error(`Failed to save JSON: ${error.message}`);
	}
});
