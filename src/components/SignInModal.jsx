'use client';
import Link from 'next/link';

export default function SignInModal({ onClick }) {
	return (
		<div className="fixed flex justify-center items-center top-0 left-0 h-full w-full bg-gray-700 bg-opacity-70 z-20">
			<div className="relative w-1/4 h-1/4 p-5 flex flex-col gap-10 rounded-lg shadow-lg justify-center items-center bg-white text-center">
				<button
					onClick={onClick}
					className="absolute top-0 right-0 m-3 text-2xl transition-all hover:text-blue-500"
				>
					&#10005;
				</button>
				<h1 className="text-xl text-shadow-light">
					Sign up to add your favorite anime and manga to list
				</h1>
				<nav className="flex gap-10">
					<Link
						href={'/sign-up'}
						className="underline text-xl text-shadow-light transition-all hover:text-blue-500"
					>
						Sign up
					</Link>
					<Link
						href={'/log-in'}
						className="underline text-xl text-shadow-light transition-all hover:text-blue-500"
					>
						Log in
					</Link>
				</nav>
			</div>
		</div>
	);
}

export function VerticalDivider() {
	return (
		<div className="h-10 border-2 border-gray-600 border-opacity-75 rounded-lg"></div>
	);
}
