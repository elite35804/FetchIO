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

export function DeleteModal({ isOpen, data, onClose, onSave, type }: any) {
	return (
		<Dialog open={isOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Delete a {type}</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Are you sure to delete this <b>{data?.name}</b> permanently?
				</DialogDescription>
				<DialogFooter>
					<Button onClick={onClose} variant="outline" className="bg-input">
						Cancel
					</Button>
					<Button onClick={onSave} className="bg-red-600 text-white">
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
