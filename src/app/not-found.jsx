import Link from 'next/link';

export default function Error() {
	return (
		<main className="flex justify-center items-center grow flex-col gap-6">
			<p className="text-5xl text-shadow-light">404 Not found</p>
			<Link
				href={'/'}
				className="font-trebuchet font-bold text-xl pt-1 pb-1 pl-3 pr-3 rounded-md text-white bg-blue-800 text-center transition-all hover:bg-blue-700"
			>
				Back home
			</Link>
		</main>
	);
}
