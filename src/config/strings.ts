export const $settings = {
	title: 'Settings',
	description: 'Manage your account settings and application preferences',
	app: {
		githubUrl: 'https://github.com/shipkit-io/electron-bones',
		repo: 'shipkit-io/electron-bones',
		description: 'A boilerplate for Electron applications',
	},
	appearance: {
		themeLabel: 'Theme',
		themeDescription: 'Select the theme for the application',
		light: 'Light',
		dark: 'Dark',
		system: 'System',
	},
	theme: {
		themeLabel: 'Theme',
		themeDescription: 'Select the theme for the application',
		light: 'Light',
		dark: 'Dark',
		system: 'System',
		action: 'Change Theme',
	},
};

export const $dialog = {
	error: {
		title: 'An error occurred',
		ignore: 'Ignore',
		report: 'Report',
		quit: 'Quit',
	},
};

export const $errors = {
	prefix: 'Main> ',
	blockedNavigation: 'Blocked navigation to: ',
	invalidChannel: 'Invalid IPC channel',
	github: 'Failed to fetch GitHub data',
};

export const $messages = {
	resetStore: 'Reset App',

	// Network messages
	online: 'Connected',
	offline: 'Disconnected - No internet connection',
};

export const $autoUpdate = {
	autoUpdate: 'Checking for updates...',
	updateAvailable: 'Update Available',
	updateAvailableBody: 'Click to download',
};

export const $init = {
	// Timing messages
	app: 'Initializing...',
	startup: 'Starting...',
	started: 'Started',
	ready: 'App Ready',
	logger: 'Initializing logger...',
	refreshSettings: 'Refreshing settings...',
	resetApp: 'Resetting app...',
	appListeners: 'Registering app listeners...',
	idle: 'Idle',
};
