import { GlobalContextProvider } from '@/renderer/context/global-context';
import { ThemeProvider } from '@/renderer/context/theme-context';

import React from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<React.StrictMode>
			<GlobalContextProvider>
				<ThemeProvider>{children}</ThemeProvider>
			</GlobalContextProvider>
		</React.StrictMode>
	);
}
