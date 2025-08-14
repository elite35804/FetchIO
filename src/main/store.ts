import Store from 'electron-store';
import { DEFAULT_SETTINGS, SettingsType } from '../config/settings';

export type AppMessageType = string;

export type AppMessageLogType = AppMessageType[];

export interface StoreType {
	settings: SettingsType;
	appMessageLog: AppMessageLogType; // Public-facing console.log()
}

const schema: Store.Schema<StoreType> = {
	appMessageLog: {
		type: 'array',
		default: [],
	},
	settings: {
		type: 'object',
		properties: {
			quitOnWindowClose: {
				type: 'boolean',
			},
			theme: {
				type: 'string',
				enum: ['system', 'light', 'dark'],
			},
		},
		default: DEFAULT_SETTINGS,
	},
};

const store = new Store<StoreType>({ schema });

export default store;
