import { app } from 'electron';
import Logger from 'electron-log/main';
import { $init } from '../config/strings';
import appListeners from './app-listeners';
import { createMainWindow } from './create-window';
import debugging from './debugging';
import logger from './logger';
import protocol from './protocol';
import { resetApp } from './reset';
import { is } from './util';
import windows from './windows';

export const startup = () => {
	console.timeLog(app.name, $init.startup);

	// Initialize logger
	logger.initialize();

	if (is.debug) {
		// Reset the app and store to default settings
		resetApp();
	}

	// Enable electron debug and source map support
	debugging.initialize();

	protocol.register();

	// Register app listeners, e.g. `app.on()`
	appListeners.register();

	Logger.status($init.started);
	console.timeLog(app.name, $init.started);
};

export const ready = async () => {
	Logger.status($init.started);
	console.timeLog(app.name, $init.ready);

	// Register custom protocol like `app://`
	protocol.initialize();

	// Add remaining app listeners
	appListeners.ready();

	// Create the main browser window.
	windows.mainWindow = await createMainWindow();

	console.timeLog(app.name, $init.mainIdle);
};

process.on('uncaughtException', (error) => {
	Logger.error('Uncaught exception:', error);
	// Optionally, you can show an error dialog to the user here
});

process.on('unhandledRejection', (reason, promise) => {
	Logger.error('Unhandled rejection at:', promise, 'reason:', reason);
	// Optionally, you can show an error dialog to the user here
});
