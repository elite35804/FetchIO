import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, DownloadIcon } from '@radix-ui/react-icons';
import { Separator } from '@/components/ui/separator';
import { DeleteModal } from '../../custom/DeleteModal';

interface Task {
	id?: number;
	name: string;
	group: any;
	proxy: any;
	result: any;
	isLoading: boolean;
}

export function TicketDetail() {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');
	const [isOpenDelete, setOpenDelete] = useState(false);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [task, setTask] = useState<Task | null>();
	const [orders, setOrders] = useState([]);
	const [order, setOrder] = useState<any>({});

	const navigate = useNavigate();

	useEffect(() => {
		window.electron
			.readJson('tasks')
			.then((data) => {
				if (data) {
					setTasks(data);
					setTask(data.find((d: any) => d?.id === id));
					const items: any = [];
					data
						.find((d: any) => d?.id === id)
						?.result?.accounts_info?.map((a: any) =>
							a?.orders?.map((or: any) =>
								items.push({
									...or,
									email: a?.account,
									currency: a?.currency,
								}),
							),
						);
					setOrders(items);
				}
			})
			.catch((err: any) => {
				console.log(err);
			});
	}, []);

	const onDelete = () => {
		setOrders([...orders.filter((o: any) => o?.order_id !== order?.order_id)]);
		const list: any = [...tasks];
		list
			.find((l: any) => l.id === task?.id)
			.result.accounts_info.find((a: any) => a.account === order.email).orders =
			list
				.find((l: any) => l?.id === task?.id)
				?.result.accounts_info?.find((a: any) => a?.account === order?.email)
				?.orders.filter((o: any) => o?.order_id !== order?.order_id);
		window.electron
			.saveToJson(list, 'tasks')
			.then(() => {
				setTasks((prev) => [...prev.filter((g) => g?.id !== task?.id)]);
				setTask(null);
				setOpenDelete(false);
			})
			.catch((err: any) => console.log(err));
	};

	const onDownload = () => {
		const items: any = [];
		const res = task?.result;
		res.accounts_info?.forEach((acc: any) => {
			acc?.orders?.forEach((ord: any) => {
				ord?.events?.forEach((event: any) => {
					event?.tickets?.forEach((ticket: any) => {
						items.push({
							Module: res?.module,
							Email: acc?.account,
							'Order Id': ord?.order_id,
							Currency: acc?.currency,
							Price: ticket?.price,
							'Event Date': event?.event_date,
							'Event Name': event?.event_name,
							Section: `${ticket?.section_type} ${ticket?.section_seat}`,
							Row: ticket?.row_seat,
							Seat: ticket?.seat,
						});
					});
				});
			});
		});
		const headers = Object.keys(items[0]);

		// Create CSV rows
		const csvRows = [
			headers.join(','), // Header row
			...items.map((item: any) =>
				headers
					.map((header: string) => {
						// Handle values that might contain commas by wrapping in quotes
						const value = item[header] || '';
						return typeof value === 'string' && value.includes(',')
							? `"${value}"`
							: value;
					})
					.join(','),
			),
		];
		const csv = csvRows.join('\n');
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', `${task?.name}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center -mb-3">
				<div>
					<h3 className="text-lg font-medium">Ticket Detail</h3>
					<p className="text-sm text-muted-foreground">Manage your tickets.</p>
					<button
						onClick={() => navigate(-1)}
						type="button"
						className="flex items-center space-x-2 text-sm mt-3 cursor-pointer"
					>
						<ChevronLeftIcon className="w-4 h-4" /> Back
					</button>
				</div>
				{task?.result?.accounts_info?.length > 0 && (
					<DownloadIcon
						onClick={onDownload}
						className="w-6 h-6 cursor-pointer text-[#47BDFB]"
					/>
				)}
			</div>
			<Separator />
			<div className="flex flex-wrap gap-4">
				{orders?.map((item: any) => (
					<div
						key={item.order_id}
						className="border rounded-lg p-4 space-y-2 bg-[#1F222F] w-56 flex flex-col items-center"
					>
						<div className="text-left w-full text-xs text-ellipsis">
							<b>EMAIL:</b> {item.email}
						</div>
						<div className="text-left w-full text-xs leading-[10px] pt-2">
							<b>ORDER:</b> #{item.order_id}
						</div>
						<div className="text-left w-full text-xs leading-[10px]  ">
							<b>ORDER DATE:</b> {item.order_date}
						</div>
						<div className="text-left w-full text-xs leading-[10px]  ">
							<b>TOTAL PRICE:</b> {item.currency === 'EUR' ? '€' : '$'}
							{item.price}
						</div>
						<div className="grid grid-cols-2 items-center space-x-2 w-full pt-2">
							<Button
								onClick={() =>
									navigate(
										`/Settings/order-detail?id=${item?.order_id}&taskId=${id}&email=${item.email}`,
									)
								}
								size="sm"
								className="mt-0 text-sm !w-full h-7"
							>
								Open
							</Button>
							<Button
								size="sm"
								className="mt-0 text-sm flex-1 bg-red-500 h-7 flex text-white"
								onClick={() => {
									setOrder(item);
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
				data={{ name: 'order' }}
				onClose={() => setOpenDelete(false)}
				onSave={onDelete}
				type="Order"
			/>
		</div>
	);
}
