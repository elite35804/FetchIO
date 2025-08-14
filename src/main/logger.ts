import { app, dialog } from 'electron';
import Logger from 'electron-log/main';
import path from 'path';
import { $dialog, $init } from '../config/strings';

const { bugs } = require('../../package.json');

// Initialize logger and error handler
const initialize = () => {
	// initialize  the logger for any renderer process
	Logger.initialize({ preload: true });

	// Add custom log level to display app status messages
	Logger.addLevel('status', 0);

	Logger.status($init.logger);
};

export default { initialize };
