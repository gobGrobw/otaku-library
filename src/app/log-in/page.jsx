'use client';
import { useRouter } from 'next/navigation';
import { LabelInput } from '../sign-up/page';
import { useState } from 'react';

export default function LoginPage() {
	const [error, setError] = useState('');
	const router = useRouter();

	async function postLogin(data) {
		const url = 'http://otakulibrary.runasp.net/api/Auth/log-in';

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			if (response.ok) {
				const resJson = await response.json();
				localStorage.setItem('token', resJson.jwt_token);
				localStorage.setItem('logged_in', true);

				return router.push('/');
			}

			const resText = await response.text();
			setError(resText);
		} catch (error) {
			console.error(error);
		}
	}

	function handleLogin(e) {
		e.preventDefault();
		const formValue = new FormData(e.target);
		const loginData = {
			username: formValue.get('Username'),
			password: formValue.get('Password'),
		};

		postLogin(loginData);
	}

	return (
		<main className="flex flex-col mt-20 justify-center items-center gap-5">
			<h1 className="text-3xl font-semibold text-shadow-light">Log in form</h1>
			<hr className="w-96 border-gray-400" />

			{/* Form */}
			<form onSubmit={handleLogin} className="flex flex-col gap-3">
				<LabelInput id={'Username'} />
				<LabelInput id={'Password'} inputType="password" />

				{error !== '' && (
					<p className="text-red-500 text-shadow-light text-center">
						{error}
					</p>
				)}

				<button
					type="submit"
					className="p-1 pl-2 pr-2 bg-blue-700 text-white rounded-lg mt-3 text-shadow-light shadow-sm transition-all hover:bg-blue-600"
				>
					Sign up
				</button>
			</form>
		</main>
	);
}
