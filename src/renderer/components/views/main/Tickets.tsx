import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PROTOCOL } from '@/config/config';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { DeleteModal } from '../../custom/DeleteModal';

interface Task {
	id?: number;
	name: string;
	group: any;
	proxy: any;
	result: any;
	isLoading: boolean;
}

export function Tickets() {
	const navigate = useNavigate();
	const location = useLocation();

	console.log(location);
	const [isOpenDelete, setOpenDelete] = useState(false);
	const types = [
		{
			id: 0,
			name: 'TM FR',
			icon: 'ticketmaster.png',
			module: 'ticketmaster_fr',
		},
		{
			id: 2,
			name: 'TM EU',
			icon: 'ticketmaster.png',
			module: 'ticketmaster_eu',
		},
		{ id: 3, name: 'Arsenal', icon: 'arsenal.png', module: 'arsenal_fc' },
		{ id: 4, name: 'Chelsea', icon: 'chelsea.png', module: 'chelsea_fc' },
		{ id: 5, name: 'Everton', icon: 'everton.jpeg', module: 'everton_fc' },
		{
			id: 6,
			name: 'Tottenham',
			icon: 'tottenham.jpeg',
			module: 'tottenham_fc',
		},
		{ id: 7, name: 'LFC', icon: 'liverpool.jpeg', module: 'liverpool_fc' },
		{
			id: 8,
			name: 'New Castle',
			icon: 'new_castle.jpeg',
			module: 'newcastle_fc',
		},
		{
			id: 9,
			name: 'Man City',
			icon: 'mac_city.png',
			module: 'mancity_fc',
		},
		{
			id: 10,
			name: 'Man Utd',
			icon: 'man_united.jpeg',
			module: 'manutd_fc',
		},
	];
	const [tasks, setTasks] = useState<Task[]>([]);
	const [task, setTask] = useState<Task | null>();

	useEffect(() => {
		window.electron
			.readJson('tasks')
			.then((data) => {
				if (data) {
					setTasks(data);
				}
			})
			.catch((err: any) => {
				console.log(err);
			});
	}, []);

	const onDelete = () => {
		window.electron
			.saveToJson(
				tasks.filter((g) => g?.id !== task?.id),
				'tasks',
			)
			.then(() => {
				setTasks((prev) => [...prev.filter((g) => g?.id !== task?.id)]);
				setTask(null);
				setOpenDelete(false);
			})
			.catch((err: any) => console.log(err));
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Tickets</h3>
				<p className="text-sm text-muted-foreground">Manage your tickets.</p>
			</div>
			<Separator />
			<div className="flex flex-wrap gap-4">
				{tasks.map((task) => (
					<div
						key={task.id}
						className="border rounded-lg p-4 space-y-2 bg-[#1F222F] w-56 flex flex-col items-center"
					>
						<img
							src={`${PROTOCOL}://${types.find((type) => type.name === task?.group.type)?.icon}`}
							alt="logo"
							className="h-8 rounded-full"
						/>
						<div className="text-left w-full text-sm">{task.name}</div>
						<div className="text-left w-full text-xs text-gray-300">
							{task.result?.accounts_info?.length} ACCOUNTS PROCESSED
						</div>
						<div className="flex items-center space-x-2 w-full">
							{task.result?.accounts_info?.length > 0 && (
								<Button
									onClick={() => navigate(`/Settings/ticket?id=${task.id}`)}
									size="sm"
									className="mt-0 flex-1 text-sm !w-full h-7"
								>
									Open
								</Button>
							)}
							<Button
								size="sm"
								className="mt-0 text-sm flex-1 bg-red-500 h-7 !w-full flex text-white"
								onClick={() => {
									setTask(task);
									setOpenDelete(true);
								}}
							>
								Delete
							</Button>
						</div>
					</div>
				))}
			</div>

			<DeleteModal
				isOpen={isOpenDelete}
				data={task}
				onClose={() => {
					setOpenDelete(false);
					setTask(null);
				}}
				onSave={onDelete}
				type="Task"
			/>
		</div>
	);
}
