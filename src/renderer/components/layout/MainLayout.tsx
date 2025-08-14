import { Menu } from '@/renderer/components/menu/Menu';
import { useGlobalContext } from '@/renderer/context/global-context';
import { PROTOCOL } from '@/config/config';

import React from 'react';
import { Outlet } from 'react-router-dom';

// We can't use the ScrollArea here or the scroll will persist between navigations
export function MainLayout({ children }: { children?: React.ReactNode }) {
	const { settings } = useGlobalContext();

	return (
		<div className="w-full h-full flex flex-col">
			<img
				className="fixed inset-0 w-full h-full"
				src={`${PROTOCOL}://blue-bg1.jpg`}
				alt="logo"
			/>
			<div
				className="fixed inset-0 w-full h-full z-10"
				style={{
					backdropFilter: 'blur(20px)',
					background: 'rgba(255, 255, 255, 0.05)',
				}}
			/>
			<div className='bg-[#171520] fixed inset-0 h-[34px] z-20 titlebar'></div>
			<div className="border-t grow flex min-h-0">
				<div className="grow min-w-0 overflow-y-auto">
					{children || <Outlet />}
				</div>
			</div>
		</div>
	);
}
