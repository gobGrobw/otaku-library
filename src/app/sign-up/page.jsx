'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignupPage() {
	const [error, setError] = useState('');
	const router = useRouter();

	async function postSignUp(data) {
		// const url = 'http://otakulibrary.runasp.net/api/Auth/sign-up';
		const url = 'http://otakulibrary.runasp.net/api/Auth/sign-up';

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			if (response.ok) {
				return router.push('/log-in');
			}

			const resText = await response.text();
			setError(resText);
		} catch (error) {
			console.error(error);
		}
	}

	function handleSignUp(e) {
		e.preventDefault();

		const formValue = new FormData(e.target);
		const checkEmail =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		const signUpData = {
			username: formValue.get('Username'),
			password: formValue.get('Password'),
			email: formValue.get('Email'),
		};

		if (
			signUpData.username !== '' &&
			signUpData.password !== '' &&
			checkEmail.test(signUpData.email)
		) {
			postSignUp(signUpData);
		}
	}

	return (
		<main className="flex flex-col mt-20 justify-center items-center gap-5">
			<h1 className="text-3xl font-semibold text-shadow-light">
				Sign up form
			</h1>
			<hr className="w-96 border-gray-400" />

			{/* Form */}
			<form onSubmit={handleSignUp} className="flex flex-col gap-3">
				<LabelInput
					id={'Username'}
					minLength={5}
					errorMsg={'Username has to be atleast 5 letters long'}
				/>
				<LabelInput
					id={'Password'}
					inputType="password"
					minLength={5}
					errorMsg={'Username has to be atleast 5 letters long'}
				/>
				<LabelInput
					id={'Email'}
					inputType="email"
					errorMsg={'Enter a valid email'}
				/>

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

export function LabelInput({
	id,
	inputType = 'text',
	minLength = 0,
	errorMsg = '',
}) {
	const [inputValue, setInputValue] = useState('');
	const min = minLength;

	return (
		<div className="flex flex-col w-96">
			<label className="pl-1 text-shadow-light" htmlFor={id}>
				{id}
			</label>
			<input
				className="rounded-lg shadow-md p-1 pl-2 pr-2 ring-2 ring-gray-400 ring-opacity-35"
				name={id}
				id={id}
				type={inputType}
				minLength={min}
				onInput={(e) => setInputValue(e.target.value)}
			/>
			{inputValue.length < 5 && inputValue !== '' && (
				<p className="text-red-600">{errorMsg}</p>
			)}
		</div>
	);
}
