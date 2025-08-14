import React from 'react';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '../ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function EditProxyModal({
	isOpen,
	data,
	onClose,
	onSave,
	handleChange,
	handleFileChange,
	errorType,
	error,
}: any) {
	return (
		<Dialog open={isOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{data?.id ? 'Edit' : 'Add'} a Proxy</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4">
					<div className="grid gap-3">
						<Label>Proxy Group Name</Label>
						<div className="space-y-1">
							<Input
								id="username"
								name="Proxy Group Name"
								value={data.name}
								onChange={(e) => handleChange(e.target.value, 'name')}
								placeholder="Please type your proxy group name"
							/>
							{errorType === 'name' && (
								<div className="text-xs text-red-400">{error}</div>
							)}
						</div>
					</div>
					<div className="grid gap-3">
						<Label>Proxies</Label>
						<div className="space-y-1">
							<Textarea
								id="proxies"
								name="Proxies"
								value={data.proxies}
								onChange={(e) => handleChange(e.target.value, 'proxies')}
								placeholder={`ip:port:user:passw\nip:port:user:passw`}
								style={{
									resize: 'none',
								}}
								rows={5}
							/>
							{errorType === 'proxies' && (
								<div className="text-xs text-red-400">{error}</div>
							)}
						</div>

						<Input
							id="file"
							name="file"
							type="file"
							onChange={(e) => handleFileChange(e)}
						/>
						<div className="italic text-xs text-gray-400">
							File format should be csv and it will be like this.
							<br />
							ip:port:user:passw
							<br />
							ip:port:user:passw
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={onClose} variant="outline" className="bg-input">
						Cancel
					</Button>
					<Button onClick={onSave}>Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
