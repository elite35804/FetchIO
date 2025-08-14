import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function Configuration() {
	const [config, setConfig] = useState({
		captcha: '',
		datadome: '',
	});

	useEffect(() => {
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
	}, []);

	const handleChange = (value: any, key: string) => {
		const item: any = { ...config };
		item[key] = value;
		setConfig(item);
	};

	const onSave = () => {
		window.electron
			.saveToJson(config, 'config')
			.then(() => {
				console.log('Saved');
			})
			.catch((err: any) => console.log(err));
	};
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Configuration</h3>
				<p className="text-sm text-muted-foreground">
					Configure your monitor preferences.
				</p>
			</div>
			<Separator />
			<div className="border rounded-lg p-4 space-y-2 bg-[#1F222F]">
				<div>Captcha Key</div>
				<Input
					placeholder="Please enter your captcha key"
					value={config.captcha}
					onChange={(e) => handleChange(e.target.value, 'captcha')}
				/>
			</div>
			<div className="border rounded-lg p-4 space-y-2 bg-[#1F222F]">
				<div>Datadome Key</div>
				<Input
					placeholder="Please enter your datadome key"
					value={config.datadome}
					onChange={(e) => handleChange(e.target.value, 'datadome')}
				/>
			</div>
			<div className="flex justify-end items-center">
				<Button onClick={onSave} className="mt-0 text-sm">
					Save
				</Button>
			</div>
		</div>
	);
}
