import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '../ui/label';

export function EditTaskModal({
	isOpen,
	data,
	onClose,
	onSave,
	handleChange,
	errorType,
	error,
	groups,
	proxies,
}: any) {
	return (
		<Dialog open={isOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{data?.id ? 'Edit' : 'Create'} a Task</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4">
					<div className="grid gap-3">
						<Label>Task Name</Label>
						<div className="space-y-1">
							<Input
								id="username"
								name="Task Group Name"
								value={data.name}
								onChange={(e) => handleChange(e.target.value, 'name')}
								placeholder="Please type your task group name"
							/>
							{errorType === 'name' && (
								<div className="text-xs text-red-400">{error}</div>
							)}
						</div>
					</div>
					<div className="grid gap-3">
						<Label>Group</Label>
						<div className="space-y-1">
							<Select
								value={data.group}
								onValueChange={(val) => handleChange(val, 'group')}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a Group" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{groups?.map((group: any) => (
											<SelectItem value={group} key={group.id}>
												<div className="flex items-center space-x-2">
													<div>{group.name}</div>
												</div>
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							{errorType === 'group' && (
								<div className="text-xs text-red-400">{error}</div>
							)}
						</div>
					</div>
					<div className="grid gap-3">
						<Label>Proxy</Label>
						<div className="space-y-1">
							<Select
								value={data.proxy}
								onValueChange={(val) => handleChange(val, 'proxy')}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select a Proxy" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{proxies?.map((proxy: any) => (
											<SelectItem value={proxy} key={proxy.id}>
												<div className="flex items-center space-x-2">
													<div>{proxy.name}</div>
												</div>
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							{errorType === 'proxy' && (
								<div className="text-xs text-red-400">{error}</div>
							)}
						</div>
					</div>
					{errorType === 'global' && (
						<div className="text-xs text-red-400">{error}</div>
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
