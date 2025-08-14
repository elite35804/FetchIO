import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { PROTOCOL } from '@/config/config';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, CLIENT_ID, REDIRECT_URI } from '@/renderer/config';
import { Alert, AlertDescription } from '../ui/alert';

export function Home() {
	const [error, setError] = useState<string | null>(null);
	const [user, setUser] = useState<any>(null);

	const navigate = useNavigate();

	useEffect(() => {
		if (error) {
			setTimeout(() => setError(null), 3000);
		}
	}, [error]);

	const discordLogin = () => {
		// Replace with your Discord Client ID
		const redirectUri = encodeURIComponent(REDIRECT_URI);
		const scope = encodeURIComponent('identify');
		const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
		window.open(authUrl, '_blank');
	};

	useEffect(() => {
		window.electron.onAuthSuccess((event: any, tokenData: any) => {
			fetch('https://discord.com/api/users/@me', {
				headers: { Authorization: `Bearer ${tokenData.access_token}` },
			})
				.then((res) => res.json())
				.then((userData) => {
					if (userData?.id !== user?.id) {
						setUser(userData);
					}
				})
				.catch((err) => setError('Failed to fetch user data'));
		});

		window.electron.onAuthError((event: any, err: any) => {
			setError('Authentication failed');
		});
	}, []);

	const handleLogin = useCallback(async () => {
		try {
			const res = await axios.post(`${API_URL}/login`, {
				discord_id: user?.id,
			});

			console.log(res);

			if (res?.data?.includes('Login successful')) {
				window.electron
					.saveToJson({ id: user?.id }, 'user')
					.then(() => {
						navigate('/Settings');
					})
					.catch((err: any) => console.log(err));
			}
		} catch (e: any) {
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
			setError(userMessage);
		}
	}, [user, navigate]);

	useEffect(() => {
		if (user?.id) {
			handleLogin();
		}
	}, [user, handleLogin]);

	// useEffect(() => {
	// 	navigate('/Settings');
	// }, [navigate]);

	return (
		<div className="w-full h-full">
			<div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center z-20 pt-24 pb-24 px-6">
				<div className="flex flex-col justify-center items-center">
					<img
						src={`${PROTOCOL}://Fetch.png`}
						alt="logo"
						className="h-40 object-contain"
					/>
				</div>

				<Button onClick={discordLogin} className="mb-2 mt-0 font-bold text-md">
					<div className="flex items-center space-x-3">
						<img
							src={`${PROTOCOL}://discord.png`}
							alt="logo"
							className="object-contain h-5 -mx-1"
						/>
						<div>Login with Discord</div>
					</div>
				</Button>
			</div>
			{error && (
				<Alert
					variant="default"
					className="fixed top-4 right-4 flex flex-col self-auto w-96 z-50 bg-[#1F222F]"
				>
					<AlertDescription className="text-red-600">{error}</AlertDescription>
				</Alert>
			)}
		</div>
	);
}
