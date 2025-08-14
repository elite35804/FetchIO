export type ThemeType = 'system' | 'light' | 'dark';

export type NotificationType = 'system' | 'app' | 'all';

export interface SettingsType {
	accentColor: string;
	startMinimized: boolean;
	quitOnWindowClose: boolean;

	theme: ThemeType;
}

// These are the default settings, imported by the store
export const DEFAULT_SETTINGS: SettingsType = {
	accentColor: '#b453ff',
	startMinimized: false,
	quitOnWindowClose: false,

	theme: 'system',
};
