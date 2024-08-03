'use client';
import Link from 'next/link';
import NavigationBar from './NavigationBar';
import { usePathname } from 'next/navigation';

export default function LayoutProvider({ children }) {
	const pathname = usePathname();
	return (
		<>
			{pathname !== '/' && <NavigationBar enableSearchBar />}
			{children}
			{pathname !== '/sign-up' && pathname !== '/log-in' && (
				<footer className="w-full bg-gray-700 text-white flex justify-center p-2 max-h-full">
					Powered by&nbsp;
					<Link
						href={'https://docs.api.jikan.moe/#section/Information'}
						className="underline transition-all hover:text-blue-400"
					>
						Jikan API
					</Link>
				</footer>
			)}
		</>
	);
}
