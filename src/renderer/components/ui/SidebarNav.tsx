'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
	items: {
		href: string;
		title: string;
		icon?: React.ElementType;
	}[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
	const { pathname } = useLocation();
	console.log(pathname);
	const currentPage = items.find((item) => pathname.endsWith(item.href));

	return (
		<nav
			className={cn(
				'flex flex-wrap flex-col items-start justify-stretch mx-3 space-y-2',
				className,
			)}
			{...props}
		>
			{items.map((item) => {
				return (
					<Link
						draggable={false}
						key={item.href}
						to={item.href}
						className={cn(
							buttonVariants({
								variant: currentPage?.href === item.href ? 'default' : 'ghost',
							}),
							currentPage?.href === item.href
								? 'bg-[#47BDFB] hover:bg-[#47BDFB]'
								: 'font-normal',
							currentPage?.href === item.href ? 'font-bold' : 'font-normal',
							'justify-start w-full flex gap-2 rounded-lg py-4',
						)}
					>
						{item.icon && <item.icon />}
						{item.title}
					</Link>
				);
			})}
		</nav>
	);
}
