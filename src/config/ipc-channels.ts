// Whitelist channels for IPC
export type Channels = string;

// Main -> Renderer
const APP_UPDATED = 'app-updated';

// Renderer -> Main
const GET_APP_INFO = 'get-app-info';
const GET_APP_PATHS = 'get-app-paths';
const GET_RENDERER_SYNC = 'get-renderer-sync';

const SET_SETTINGS = 'set-settings';

const RENDERER_READY = 'renderer-ready';

export const ipcChannels = {
	// main -> renderer
	APP_UPDATED,

	// renderer -> main
	RENDERER_READY,
	GET_RENDERER_SYNC,
	GET_APP_INFO,
	GET_APP_PATHS,

	SET_SETTINGS,
} as const;
