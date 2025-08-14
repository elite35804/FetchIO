import {
	GearIcon,
	GroupIcon,
	TableIcon,
	LoopIcon,
	DragHandleDots1Icon,
} from '@radix-ui/react-icons';

import { Groups } from '../components/views/main/Groups';
import { Proxies } from '../components/views/main/Proxies';
import { Tasks } from '../components/views/main/Tasks';
import { Configuration } from '../components/views/main/Configuration';
import { Tickets } from '../components/views/main/Tickets';

export const nav = {
	home: {
		title: 'Home',
		href: '/',
	},
	settings: {
		title: 'Settings',
		href: '/settings',
	},
};

export const settingsNavItems = [
	{
		title: 'Groups',
		href: 'groups',
		element: <Groups />,
		icon: GroupIcon,
		index: true,
	},
	{
		title: 'Proxies',
		href: 'proxies',
		element: <Proxies />,
		icon: LoopIcon,
	},

	{
		title: 'Configuration',
		href: 'configuration',
		element: <Configuration />,
		icon: GearIcon,
	},
	{
		title: 'Tasks',
		href: 'tasks',
		element: <Tasks />,
		icon: TableIcon,
	},
	{
		title: 'Tickets',
		href: 'tickets',
		element: <Tickets />,
		icon: DragHandleDots1Icon,
	},
];
