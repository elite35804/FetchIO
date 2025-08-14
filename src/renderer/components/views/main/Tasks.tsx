import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PROTOCOL } from '@/config/config';
import { API_URL } from '@/renderer/config';
import {
	Cross1Icon,
	CheckIcon,
	ClipboardCopyIcon,
} from '@radix-ui/react-icons';
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import axios from 'axios';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../../ui/table';
import { DeleteModal } from '../../custom/DeleteModal';
import { EditTaskModal } from '../../custom/EditTaskModal';

interface Task {
	id?: number;
	temp_id?: number;
	name: string;
	group: any;
	proxy: any;
	result: any;
	isLoading: boolean;
}
interface Proxy {
	id?: number;
	name: string;
	proxies: string;
}
interface Group {
	id?: number;
	name: string;
	accounts: string;
	type: string;
}
interface Configuration {
	captcha: string;
	datadome: string;
}
const initTask: Task = {
	name: '',
	group: null,
	proxy: null,
	result: {},
	isLoading: false,
};

export function Tasks() {
	const [task, setTask] = useState<Task>(initTask);
	const [proxies, setProxies] = useState<Proxy | null>(null);
	const [groups, setGroups] = useState<Group | null>(null);
	const [config, setConfig] = useState<Configuration | null>(null);
	const [error, setError] = useState('');
	const [errorType, setErrorType] = useState('');
	const [isOpenTask, setOpenTask] = useState(false);
	const [isOpenDelete, setOpenDelete] = useState(false);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [id, setId] = useState(null);
	const [isShow, setShow] = useState(false);
	const [isShowCopy, setShowCopy] = useState(false);
	const [selected, setSelected] = useState<string>('');
	const [isShowError, setShowError] = useState(false);
	const [reqError, setReqError] = useState('');
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

	useEffect(() => {
		if (isShow) {
			setTimeout(() => setShow(false), 3000);
		}
	}, [isShow]);
	useEffect(() => {
		if (isShowCopy) {
			setTimeout(() => setShowCopy(false), 3000);
		}
	}, [isShowCopy]);

	useEffect(() => {
		if (isShowError) {
			setTimeout(() => setShowError(false), 3000);
		}
	}, [isShowError]);
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
		window.electron
			.readJson('proxies')
			.then((data) => {
				if (data) {
					setProxies(data);
				}
			})
			.catch((err: any) => {
				console.log(err);
			});
		window.electron
			.readJson('groups')
			.then((data) => {
				if (data) {
					setGroups(data);
				}
			})
			.catch((err: any) => {
				console.log(err);
			});
		window.electron
			.readJson('config')
			.then((data) => {
				if (data) {
					setConfig(data);
				}
			})
			.catch((err: any) => {
				console.log(err);
			});
		window.electron
			.readJson('user')
			.then((data) => {
				if (data) {
					setId(data?.id);
				}
			})
			.catch((err: any) => {
				console.log(err);
			});
	}, []);

	// Monitor tasks state changes
	useEffect(() => {
		console.log('Tasks state updated:', tasks);
		if (tasks?.length > 0) {
			window.electron
				.saveToJson(tasks, 'tasks')
				.catch((err: any) => console.log(err));
		}
	}, [tasks]);

	function sleep(ms: number): Promise<void> {
		// eslint-disable-next-line no-promise-executor-return
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	const handleChange = (value: any, key: string) => {
		const item: Task = { ...task };
		(item as any)[key] = value;
		setTask(item);
	};

	const onClickAddTask = () => {
		setTask(initTask);
		setOpenTask(true);
	};

	const onSave = async () => {
		setError('');
		setErrorType('');
		if (!task.name) {
			setError('Task name is required!');
			setErrorType('name');
			return false;
		}
		if (!task.group?.id) {
			setError('Group is required!');
			setErrorType('group');
			return false;
		}
		if (!task.proxy?.id) {
			setError('Proxy is required!');
			setErrorType('proxy');
			return false;
		}
		if (!config?.captcha || !config?.datadome) {
			setError(
				'The configuration is not set correctly. Please configure it properly before proceeding.',
			);
			setErrorType('global');
			return false;
		}
		if (
			task.group?.accounts?.split('\n')?.length >
			task?.proxy?.proxies?.split('\n')?.length
		) {
			setError('Proxies and accounts counts are not matched');
			setErrorType('global');
			return false;
		}

		try {
			const list: any[] = [...tasks];
			if (task?.id) {
				const index = list.findIndex((l) => l?.id === task?.id);
				list[index] = task;
			} else if (task?.temp_id) {
				const index = list.findIndex((l) => l?.temp_id === task?.temp_id);
				list[index] = task;
			} else {
				list.push({
					...task,
					result: {}, // Ensure result is initialized
					isLoading: false, // Ensure isLoading is initialized
					temp_id: new Date().getTime(),
				});
			}
			window.electron
				.saveToJson(list, 'tasks')
				.then(() => {
					setTasks(list);
					setOpenTask(false);
				})
				.catch((err: any) => console.log(err));
		} catch (e: any) {
			console.log(e);
		}
	};

	const onDelete = () => {
		console.log(task, 'task');
		window.electron
			.saveToJson(
				task?.id
					? tasks.filter((g) => g?.id !== task?.id)
					: tasks.filter((g) => g?.temp_id !== task?.temp_id),
				'tasks',
			)
			.then(() => {
				setTasks((prev) =>
					task?.id
						? [...prev.filter((g) => g?.id !== task?.id)]
						: [...prev.filter((g) => g?.temp_id !== task?.temp_id)],
				);
				setTask(initTask);
				setOpenDelete(false);
			})
			.catch((err: any) => console.log(err));
	};

	const onRun = async (item: Task) => {
		console.log(item, 'item');
		let taskId: number = item?.id || 0;
		setTasks((prevTasks) => {
			const updatedTasks = prevTasks.map((t) =>
				t.temp_id === item?.temp_id ? { ...t, isLoading: true } : t,
			);
			return updatedTasks;
		});
		if (!item?.id) {
			try {
				const accs: any = [];
				item.group?.accounts?.split('\n')?.map((a: string) =>
					accs.push({
						email: a?.split(':')?.[0],
						password: a?.split(':')?.slice(1)?.join(':'),
					}),
				);

				const params: any = {
					discord_id: id,
					module: types.find((t) => t?.name === task.group?.type)?.module,
					accounts: accs,
					proxies: task?.proxy?.proxies?.split('\n'),
					config: {
						capsolver_api: config?.captcha,
					},
					country: task?.group?.country || '',
				};
				console.log(params);
				const res = await axios.post(`${API_URL}/fetch`, params);
				console.log(res, 'res');
				taskId = res?.data?.task_id;
			} catch (e: any) {
				if (e.status === 404) {
					const items = [...tasks];
					const index = items.findIndex((i) => i?.temp_id === item?.temp_id);
					items[index] = {
						...items[index],
						isLoading: false,
					};
					window.electron
						.saveToJson(items, 'tasks')
						.then(() => setTasks([...items]))
						.catch((err: any) => console.log(err));
				}
				let userMessage = 'Something went wrong. Please try again.';
				if (e.response) {
					switch (e.response.status) {
						case 400:
							userMessage = 'Invalid request. Please check your input.';
							break;
						case 401:
							userMessage = 'Unauthorized.';
							break;
						case 404:
							userMessage = 'Requested resource not found.';
							break;
						case 429:
							userMessage = 'Too many requests. Please try again later.';
							break;
						case 500:
							userMessage = 'Server error. Please try again later.';
							break;
						default:
							userMessage = 'Unexpected error. Please try again.';
					}
				} else if (e.code === 'ECONNABORTED') {
					userMessage = 'Request timed out. Please try again.';
				} else if (e.request) {
					userMessage =
						'Unable to connect to the server. Check your internet connection.';
				}
				setReqError(userMessage);
				setShowError(true);
			}
		}
		for (;;) {
			try {
				// eslint-disable-next-line no-await-in-loop
				const res = await axios.get(`${API_URL}/status/${taskId}`);
				console.log(item.name, res.data, 'res');
				setTasks((prevTasks) =>
					prevTasks.map((t) =>
						t.temp_id === item?.temp_id
							? {
									...t,
									id: taskId,
									result: res.data,
									isLoading: !res?.data?.finished,
								}
							: t,
					),
				);
				// eslint-disable-next-line no-await-in-loop
				if (res?.data?.finished) {
					setSelected(item.name);
					setShow(true);
					break;
				}
				// eslint-disable-next-line no-await-in-loop
				await sleep(2000);
			} catch (e: any) {
				if (e.status === 404) {
					const items = [...tasks];
					const index = items.findIndex((i) => i?.id === taskId);
					items[index] = {
						...items[index],
						isLoading: false,
					};
					window.electron
						.saveToJson(items, 'tasks')
						.then(() => setTasks([...items]))
						.catch((err: any) => console.log(err));
				}
				let userMessage = 'Something went wrong. Please try again.';
				if (e.response) {
					switch (e.response.status) {
						case 400:
							userMessage = 'Invalid request. Please check your input.';
							break;
						case 401:
							userMessage = 'Unauthorized.';
							break;
						case 404:
							userMessage = 'Requested resource not found.';
							break;
						case 429:
							userMessage = 'Too many requests. Please try again later.';
							break;
						case 500:
							userMessage = 'Server error. Please try again later.';
							break;
						default:
							userMessage = 'Unexpected error. Please try again.';
					}
				} else if (e.code === 'ECONNABORTED') {
					userMessage = 'Request timed out. Please try again.';
				} else if (e.request) {
					userMessage =
						'Unable to connect to the server. Check your internet connection.';
				}
				setReqError(userMessage);
				setShowError(true);
				break;
			}
		}
	};

	const onCopy = (data: any) => {
		const items: string[] = [];
		data.map((d: any) => items.push(`${d?.email} => ${d?.error}`));
		navigator.clipboard.writeText(items.join('\n'));
		setShowCopy(true);
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Tasks</h3>
				<p className="text-sm text-muted-foreground">Manage your tasks.</p>
			</div>
			<Separator />

			<div className="border rounded-lg p-4 space-y-2 bg-[#1F222F]">
				<div className="flex justify-end items-center space-x-2">
					<Button onClick={onClickAddTask} className="mt-0 text-sm">
						Add a Task
					</Button>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Task Name</TableHead>
							<TableHead>Group</TableHead>
							<TableHead>Proxy</TableHead>
							<TableHead className="text-right">Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{tasks.map((item, index) => (
							<TableRow key={index}>
								<TableCell>{item.name}</TableCell>
								<TableCell>{item.group?.name}</TableCell>
								<TableCell>{item.proxy?.name}</TableCell>
								<TableCell className="text-right flex items-center justify-end space-x-1">
									{(Object.keys(item?.result)?.length > 0 ||
										item.isLoading) && (
										<div className="flex items-center space-x-1">
											<div>{item?.result?.success_count || 0}</div>
											<div className="w-4 h-4 rounded bg-green-600 flex justify-center items-center">
												<CheckIcon className="w-4 h-4 text-white" />
											</div>
										</div>
									)}
									{(Object.keys(item?.result)?.length > 0 ||
										item.isLoading) && (
										<div className="flex items-center space-x-1">
											<div>{item?.result?.failed_count || 0}</div>
											<div className="w-4 h-4 rounded bg-red-600 flex justify-center items-center">
												<Cross1Icon className="w-3 h-3 text-white" />
											</div>
										</div>
									)}
									{!item.isLoading ? (
										<button type="button" onClick={() => onRun(item)}>
											<img
												src={`${PROTOCOL}://play.svg`}
												alt="logo"
												className="h-4 w-4 object-contain cursor-pointer"
											/>
										</button>
									) : (
										<svg
											className="animate-spin h-5 w-5 text-blue-600"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											/>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
											/>
										</svg>
									)}
									<button
										type="button"
										onClick={() => {
											setTask(item);
											setOpenTask(true);
										}}
									>
										<img
											src={`${PROTOCOL}://edit.svg`}
											alt="logo"
											className="h-4 w-4 object-contain cursor-pointer"
										/>
									</button>
									<button
										type="button"
										onClick={() => {
											setTask(item);
											setOpenDelete(true);
										}}
									>
										<img
											src={`${PROTOCOL}://trash.svg`}
											alt="logo"
											className="h-4 w-4 object-contain cursor-pointer"
										/>
									</button>
									{item?.result?.failed_count > 0 && (
										<Popover>
											<PopoverTrigger asChild>
												<div className="w-4 h-4 cursor-pointer rounded-full bg-red-600 flex justify-center items-center">
													<div className="text-white">!</div>
												</div>
											</PopoverTrigger>
											<PopoverContent className="w-[500px] bg-[#1F222F] max-h-[100px] overflow-y-scroll mr-3">
												<div className="flex justify-end items-center mb-1">
													<ClipboardCopyIcon
														onClick={() => onCopy(item?.result?.failed)}
														className="w-4 h-4 cursor-pointer text-green-500"
													/>
												</div>
												{item?.result?.failed?.map((f: any) => (
													<div
														key={f.email}
														className="flex items-center text-sm"
													>
														{f?.email} &rArr; {f?.error}
													</div>
												))}
											</PopoverContent>
										</Popover>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<EditTaskModal
				isOpen={isOpenTask}
				data={task}
				onClose={() => {
					setError('');
					setErrorType('');
					setOpenTask(false);
					setTask(initTask);
				}}
				onSave={onSave}
				handleChange={handleChange}
				error={error}
				errorType={errorType}
				proxies={proxies}
				groups={groups}
				config={config}
			/>
			<DeleteModal
				isOpen={isOpenDelete}
				data={task}
				onClose={() => {
					setOpenDelete(false);
					setTask(initTask);
				}}
				onSave={onDelete}
				type="Task"
			/>
			{isShow && (
				<Alert
					variant="default"
					className="fixed top-4 right-4 flex flex-col self-auto w-96 bg-[#1F222F]"
				>
					<AlertDescription className="text-green-300">
						Successfully completed <b>{selected}</b> task!
					</AlertDescription>
				</Alert>
			)}

			{isShowCopy && (
				<Alert
					variant="default"
					className="fixed top-4 right-4 flex flex-col self-auto w-96 bg-[#1F222F]"
				>
					<AlertDescription className="text-green-300">
						Copied to clipboard.
					</AlertDescription>
				</Alert>
			)}
			{isShowError && (
				<Alert
					variant="default"
					className="fixed top-4 right-4 flex flex-col self-auto w-96 bg-[#1F222F]"
				>
					<AlertDescription className="text-red-600">
						{reqError}
					</AlertDescription>
				</Alert>
			)}
		</div>
	);
}
