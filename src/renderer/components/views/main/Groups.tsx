import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
import { EditGroupModal } from '../../custom/EditGroupModal';

interface Group {
	id?: number;
	name: string;
	accounts: string;
	type: string;
	country?: string;
}

const initGroup: Group = {
	name: '',
	accounts: '',
	type: '',
	country: '',
};

export function Groups() {
	const [group, setGroup] = useState<Group>(initGroup);
	const [error, setError] = useState('');
	const [errorType, setErrorType] = useState('');
	const [isOpenGroup, setOpenGroup] = useState(false);
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

	const countries = [
		'ES',
		'CZ',
		'DE',
		'NL',
		'NO',
		'AT',
		'PL',
		'SE',
		'CH',
		'UK',
	];
	const [groups, setGroups] = useState<Group[]>([]);

	useEffect(() => {
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
	}, []);

	const handleChange = (value: any, key: string) => {
		const item: any = { ...group };
		item[key] = value;
		setGroup(item);
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
				.map((line) =>
					[
						line.trim().split(',')[0],
						line.trim()?.split(',')?.slice(1)?.join(','),
					].join(':'),
				)
				.filter((line) => line.length > 0);
			// Optionally, validate each line here
			setGroup((prev) => ({
				...prev,
				accounts: lines.join('\n'),
			}));
		};
		reader.readAsText(file);
	};

	const onClickAddGroup = () => {
		setGroup(initGroup);
		setOpenGroup(true);
	};

	const onSave = () => {
		setError('');
		setErrorType('');
		if (!group.name) {
			setError('Group name is required!');
			setErrorType('name');
			return false;
		}

		if (!group.accounts) {
			setError('Accounts are required!');
			setErrorType('accounts');
			return false;
		}

		const regex = /^([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+):(.+)$/gm;
		const allValid =
			group.accounts.match(regex)?.length === group.accounts.split('\n').length;

		if (!allValid) {
			setError('Accounts format is invalid.');
			setErrorType('accounts');
			return false;
		}

		// Check for duplicated emails
		const accounts = group.accounts
			.split('\n')
			.filter((line) => line.trim() !== '');
		const emails = accounts.map((line) => line.split(':')[0]);
		const uniqueEmails = new Set(emails);

		if (emails.length !== uniqueEmails.size) {
			setError('Duplicate emails are not allowed.');
			setErrorType('accounts');
			return false;
		}

		if (!group.type) {
			setError('Group Type is required!');
			setErrorType('type');
			return false;
		}

		if (group.type === 'TM EU' && !group.country) {
			setError('Country is required!');
			setErrorType('country');
			return false;
		}
		const list: any[] = [...groups];
		if (group.id) {
			const index = list.findIndex((l) => l?.id === group?.id);
			list[index] = group;
		} else {
			const id = new Date().getTime();
			list.push({
				...group,
				id,
			});
		}

		window.electron
			.saveToJson(list, 'groups')
			.then(() => {
				setGroups(list);
				setOpenGroup(false);
			})
			.catch((err: any) => console.log(err));
	};

	const onDelete = () => {
		window.electron
			.saveToJson(
				groups.filter((g) => g?.id !== group?.id),
				'groups',
			)
			.then(() => {
				setGroups((prev) => [...prev.filter((g) => g?.id !== group?.id)]);
				setGroup(initGroup);
				setOpenDelete(false);
			})
			.catch((err: any) => console.log(err));
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Groups</h3>
				<p className="text-sm text-muted-foreground">Manage your groups.</p>
			</div>
			<Separator />

			<div className="border rounded-lg p-4 space-y-2 bg-[#1F222F]">
				<div className="flex justify-end items-center space-x-2">
					<Button onClick={onClickAddGroup} className="mt-0 text-sm">
						Add a Group
					</Button>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Group Name</TableHead>
							<TableHead>Group Type</TableHead>
							<TableHead>Accounts Amount</TableHead>
							<TableHead className="text-right">Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{groups.map((item) => (
							<TableRow key={item.id}>
								<TableCell>{item.name}</TableCell>
								<TableCell>
									<div className="flex items-center space-x-2">
										<div className="flex items-center space-x-2">
											<img
												src={`${PROTOCOL}://${types.find((type) => type.name === item.type)?.icon}`}
												alt="logo"
												className="h-5 w-5 rounded-full"
											/>
											<div>{item.type}</div>
										</div>
									</div>
								</TableCell>
								<TableCell>{item.accounts?.split('\n')?.length}</TableCell>
								<TableCell className="text-right flex items-center justify-end space-x-2">
									<button
										type="button"
										onClick={() => {
											setGroup(item);
											setOpenGroup(true);
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
											setGroup(item);
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
			<EditGroupModal
				isOpen={isOpenGroup}
				data={group}
				onClose={() => {
					setError('');
					setErrorType('');
					setOpenGroup(false);
					setGroup(initGroup);
				}}
				onSave={onSave}
				handleFileChange={handleFileChange}
				handleChange={handleChange}
				error={error}
				errorType={errorType}
				types={types}
				countries={countries}
			/>
			<DeleteModal
				isOpen={isOpenDelete}
				data={group}
				onClose={() => {
					setOpenDelete(false);
					setGroup(initGroup);
				}}
				onSave={onDelete}
				type="Group"
			/>
		</div>
	);
}
