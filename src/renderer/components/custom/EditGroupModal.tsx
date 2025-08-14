import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PROTOCOL } from '@/config/config';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '../ui/label';

export function EditGroupModal({
	isOpen,
	data,
	onClose,
	onSave,
	handleChange,
	handleFileChange,
	errorType,
	error,
	types,
	countries,
}: any) {
	return (
		<Dialog open={isOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{data?.id ? 'Edit' : 'Add'} a Group</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4">
					<div className="grid gap-3">
						<Label>Group Name</Label>
						<div className="space-y-1">
							<Input
								id="username"
								name="Group Name"
								value={data.name}
								onChange={(e) => handleChange(e.target.value, 'name')}
								placeholder="Please type your group name"
							/>
							{errorType === 'name' && (
								<div className="text-xs text-red-400">{error}</div>
							)}
						</div>
					</div>
					<div className="grid gap-3">
						<Label>Accounts</Label>
						<div className="space-y-1">
							<Textarea
								id="accounts"
								name="Accounts"
								value={data.accounts}
								onChange={(e) => handleChange(e.target.value, 'accounts')}
								placeholder={`email:passw\nemail:passw`}
								style={{
									resize: 'none',
								}}
								rows={5}
							/>
							{errorType === 'accounts' && (
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
							email,passw
							<br />
							email,passw
						</div>
					</div>
					<div className="grid gap-3 w-full flex-1">
						<Label>Group Type</Label>
						<div className="space-y-1">
							<Select
								value={data.type}
								onValueChange={(val) => handleChange(val, 'type')}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a Group Type" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{types.map((type: any) => (
											<SelectItem value={type.name} key={type.id}>
												<div className="flex items-center space-x-2">
													<img
														src={`${PROTOCOL}://${type.icon}`}
														alt="logo"
														className="h-5 w-5 rounded-full"
													/>
													<div>{type.name}</div>
												</div>
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							{errorType === 'type' && (
								<div className="text-xs text-red-400">{error}</div>
							)}
						</div>
					</div>
					{data.type === 'TM EU' && (
						<div className="grid gap-3 w-full flex-1">
							<Label>Country</Label>
							<div className="space-y-1">
								<Select
									value={data.country}
									onValueChange={(val) => handleChange(val, 'country')}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select a Country" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{countries.map((country: any) => (
												<SelectItem value={country} key={country}>
													{country}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
								{errorType === 'country' && (
									<div className="text-xs text-red-400">{error}</div>
								)}
							</div>
						</div>
					)}
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
