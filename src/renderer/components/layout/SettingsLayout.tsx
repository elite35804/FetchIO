import { ScrollArea } from '@/renderer/components/ui/ScrollPane';
import { SidebarNav } from '@/renderer/components/ui/SidebarNav';
import { settingsNavItems } from '@/renderer/config/nav';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PROTOCOL } from '@/config/config';

interface SettingsLayoutProps {
	children?: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
	const { pathname: location } = useLocation(); // We use this to reset the scroll position when the location changes
	return (
		<>
			<div className="h-full flex flex-col justify-stretch z-20 fixed w-full inset-0 bg-[#171520] px-3 pt-10 pb-5">
				<div className="flex h-full min-h-0 space-x-2">
					<ScrollArea className="bg-[#1F222F] min-w-20 md:w-1/4 rounded-xl">
						<div className="flex items-center justify-center">
							<img
								src={`${PROTOCOL}://Fetch.png`}
								alt="logo"
								className="h-28 object-contain"
							/>
						</div>
						<SidebarNav
							items={[
								...settingsNavItems,
								// { title: 'Back', href: '/', icon: ResetIcon },
							]}
							className="py-2"
						/>
					</ScrollArea>
					<ScrollArea className="flex-1" key={location}>
						<div className="px-4 py-3 pb-10">{children || <Outlet />}</div>
					</ScrollArea>
				</div>
			</div>
		</>
	);
}
