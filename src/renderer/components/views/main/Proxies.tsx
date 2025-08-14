import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import { PROTOCOL } from '@/config/config';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../../ui/table';
import { DeleteModal } from '../../custom/DeleteModal';
import { EditProxyModal } from '../../custom/EditProxyModal';

interface Proxy {
	id?: number;
	name: string;
	proxies: string;
}
const initProxy: Proxy = {
	name: '',
	proxies: '',
};

export function Proxies() {
	const [proxy, setProxy] = useState<Proxy>(initProxy);
	const [error, setError] = useState('');
	const [errorType, setErrorType] = useState('');
	const [isOpenProxy, setOpenProxy] = useState(false);
	const [isOpenDelete, setOpenDelete] = useState(false);
	const [proxies, setProxies] = useState<Proxy[]>([]);

	useEffect(() => {
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
	}, []);

	const handleChange = (value: any, key: string) => {
		const item: Proxy = { ...proxy };
		(item as any)[key] = value;
		setProxy(item);
	};

	const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		const file = ev.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target?.result as string;
			// Split by newlines, trim, and filter out empty lines
			const lines = text
				.split(/\r?\n/)
				.map((line) => line.trim())
				.filter((line) => line.length > 0);
			// Optionally, validate each line here
			setProxy((prev) => ({
				...prev,
				proxies: lines.join('\n'),
			}));
		};
		reader.readAsText(file);
	};

	const onClickAddProxy = () => {
		setProxy(initProxy);
		setOpenProxy(true);
	};

	const onSave = () => {
		setError('');
		setErrorType('');
		if (!proxy.name) {
			setError('Proxy name is required!');
			setErrorType('name');
			return false;
		}

		if (!proxy.proxies) {
			setError('Proxies are required!');
			setErrorType('proxies');
			return false;
		}

		const regex = /^([a-zA-Z0-9.-]+):([0-9]{2,5}):([^:\s]+):([^:\s]+)$/gm;
		const allValid =
			proxy.proxies.match(regex)?.length === proxy.proxies.split('\n').length;

		if (!allValid) {
			setError('Proxies format is invalid.');
			setErrorType('proxies');
			return false;
		}
		const list: any[] = [...proxies];
		if (proxy?.id) {
			const index = list.findIndex((l) => l?.id === proxy?.id);
			list[index] = proxy;
		} else {
			const id = new Date().getTime();
			list.push({
				...proxy,
				id,
			});
		}

		window.electron
			.saveToJson(list, 'proxies')
			.then(() => {
				setProxies(list);
				setOpenProxy(false);
			})
			.catch((err: any) => console.log(err));
	};

	const onDelete = () => {
		window.electron
			.saveToJson(
				proxies.filter((g) => g?.id !== proxy?.id),
				'proxies',
			)
			.then(() => {
				setProxies((prev) => [...prev.filter((g) => g?.id !== proxy?.id)]);
				setProxy(initProxy);
				setOpenDelete(false);
			})
			.catch((err: any) => console.log(err));
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Proxies</h3>
				<p className="text-sm text-muted-foreground">Manage your proxies.</p>
			</div>
			<Separator />

			<div className="border rounded-lg p-4 space-y-2 bg-[#1F222F]">
				<div className="flex justify-end items-center space-x-2">
					<Button onClick={onClickAddProxy} className="mt-0 text-sm">
						Add a Proxy
					</Button>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Proxy Group Name</TableHead>
							<TableHead>Proxies Amount</TableHead>
							<TableHead className="text-right">Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{proxies.map((item) => (
							<TableRow key={item.id}>
								<TableCell>{item.name}</TableCell>
								<TableCell>{item.proxies?.split('\n')?.length}</TableCell>
								<TableCell className="text-right flex items-center justify-end space-x-2">
									<button
										type="button"
										onClick={() => {
											setProxy(item);
											setOpenProxy(true);
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
											setProxy(item);
											setOpenDelete(true);
										}}
									>
										<img
											src={`${PROTOCOL}://trash.svg`}
											alt="logo"
											className="h-4 w-4 object-contain cursor-pointer"
										/>
									</button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<EditProxyModal
				isOpen={isOpenProxy}
				data={proxy}
				onClose={() => {
					setError('');
					setErrorType('');
					setOpenProxy(false);
					setProxy(initProxy);
				}}
				onSave={onSave}
				handleFileChange={handleFileChange}
				handleChange={handleChange}
				error={error}
				errorType={errorType}
			/>
			<DeleteModal
				isOpen={isOpenDelete}
				data={proxy}
				onClose={() => {
					setOpenDelete(false);
					setProxy(initProxy);
				}}
				onSave={onDelete}
				type="Proxy"
			/>
		</div>
	);
}
