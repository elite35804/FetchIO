/* eslint-disable global-require */
import Logger from 'electron-log/main';
import { $init } from '../config/strings';
import { is } from './util';

const initialize = () => {
	// Enable source map support in production
	if (is.prod) {
		const sourceMapSupport = require('source-map-support');
		sourceMapSupport.install();
	}

	// Enable debug utilities in development
	if (is.debug) {
		require('electron-debug')({
			showDevTools: true,
			devToolsMode: 'undocked',
		});
	}

	Logger.status($init.debugging);
};

export default {
	initialize,
};
