import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { ChevronLeftIcon } from '@radix-ui/react-icons';

export function OrderDetail() {
	const [searchParams] = useSearchParams();
	const id = searchParams.get('id');
	const taskId = searchParams.get('taskId');
	const email = searchParams.get('email');
	const [order, setOrder] = useState<any>({});
	const [currency, setCurrency] = useState('');
	const [tickets, setTickets] = useState<any>([]);

	const navigate = useNavigate();

	useEffect(() => {
		window.electron
			.readJson('tasks')
			.then((data) => {
				if (data) {
					setCurrency(
						data
							?.find((d: any) => d?.id === taskId)
							?.result?.accounts_info?.find((a: any) => a?.account === email)
							?.currency,
					);
					const item = data
						?.find((d: any) => d?.id === taskId)
						?.result?.accounts_info?.find((a: any) => a?.account === email)
						?.orders?.find((o: any) => o?.order_id === id);
					const items: any = [];
					item.events?.map((e: any) =>
						e?.tickets?.map((t: any) =>
							items.push({
								...t,
								event: e,
							}),
						),
					);
					setTickets(items);
					setOrder(item);
				}
			})
			.catch((err: any) => {
				console.log(err);
			});
	}, [id, taskId, email]);

	return (
		<div className="space-y-6">
			<div className="-mb-3">
				<h3 className="text-lg font-medium">Ticket Detail</h3>
				<p className="text-sm text-muted-foreground">Manage your ticket.</p>

				<button
					onClick={() => navigate(-1)}
					type="button"
					className="flex items-center space-x-2 text-sm mt-3 cursor-pointer"
				>
					<ChevronLeftIcon className="w-4 h-4" /> Back
				</button>
			</div>
			<Separator />
			<div className="flex flex-wrap gap-4">
				{tickets?.map((item: any) => (
					<div
						key={new Date().getTime()}
						className="border rounded-lg p-4 space-y-2 bg-[#1F222F] w-56 flex flex-col items-center"
					>
						<div className="flex space-x-2 w-full">
							<img
								src={item?.event?.image_url}
								alt="logo"
								className="w-20 h-20 object-contain"
							/>
							<div>
								<div className="text-left w-full text-xs">
									{item?.event?.event_name}
								</div>
								<div className="text-left w-full text-xs">
									{item?.event?.event_place}
								</div>
								<div className="text-left w-full text-xs">
									{item?.event?.event_date}
								</div>
							</div>
						</div>
						<div className="text-left w-full text-xs leading-[10px] pt-2 ">
							{currency === 'EUR' ? '€' : '$'}
							{item.price}
						</div>
						<div className="text-left w-full text-xs leading-[10px]  ">
							{item?.section_type} {item?.section_seat} {item?.seat}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
