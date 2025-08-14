/* eslint global-require: off, no-console: off, promise/always-return: off */

import { app } from 'electron';
import Logger from 'electron-log/main';
import { $errors, $init } from '../config/strings';
import ipc from './ipc';
import { ready, startup } from './startup';

// Initialize the timer
console.time(app.name);
console.timeLog(app.name, $init.app);

// Register ipcMain listeners
ipc.initialize();

// SETUP APP (runs after startup())
app
	.whenReady()
	.then(ready) // <-- this is where the app is initialized
	.catch((error: Error) => {
		Logger.error($errors.prefix, error);
	});

// LAUNCH THE APP
startup();
