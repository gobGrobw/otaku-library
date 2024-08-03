'use client';
import Link from 'next/link';
import SearchHeader from './SearchBar';
import { useEffect, useState } from 'react';

export default function NavigationBar({ enableSearchBar = false }) {
	const [isLogged, setLogged] = useState(false);

	useEffect(() => {
		if (typeof window !== undefined) {
			setLogged(localStorage.getItem('logged_in') || false);
		}
	}, []);

	const linkClassName = 'text-shadow-light transition-all hover:text-blue-500';
	return (
		<nav className="h-14 flex flex-row items-center justify-between text-primary-font-color bg-primary-color shadow-lg padding-base pt-2 pb-2">
			{/* Navigation link to anime and manga list */}
			<div className="flex justify-center items-center gap-7">
				<Link href={'/'} className="flex shrink-0">
					<img className="h-10 w-h-10" src="/favicon.png" alt="alya" />
				</Link>
				{/* Anime dropdown menu */}
				<List>
					<li className="group">
						<span className="cursor-default">Anime</span>
						<ListChild>
							<Link className={linkClassName} href={'/'}>
								Browse Anime
							</Link>
							<Link className={linkClassName} href={'/top/anime'}>
								Top Anime
							</Link>
							<Link className={linkClassName} href={'/seasonal'}>
								Seasonal Anime
							</Link>
						</ListChild>
					</li>

					{/* Manga dropdown menu */}
					<li className="group">
						<span className="cursor-default">Manga</span>
						<ListChild>
							<Link className={linkClassName} href={'/'}>
								Browse Manga
							</Link>
							<Link className={linkClassName} href={'/top/manga'}>
								Top Manga
							</Link>
						</ListChild>
					</li>
				</List>
			</div>

			{enableSearchBar && (
				<div className="flex grow ml-7 mr-7 text-white">
					<SearchHeader />
				</div>
			)}

			{/* Authentication link */}
			{isLogged ? (
				<Link
					className="font-trebuchet font-bold text-xl p-1 pl-3 pr-3 rounded-md text-white bg-blue-800 text-center transition-all hover:bg-blue-700"
					href={'/dashboard'}
				>
					Dashboard
				</Link>
			) : (
				<List>
					<li>
						<Link className={linkClassName} href="/sign-up">
							Sign up
						</Link>
					</li>
					<li>
						<Link className={linkClassName} href="/log-in">
							Log in
						</Link>
					</li>
				</List>
			)}
		</nav>
	);
}

function List({ children }) {
	return (
		<ul
			className={`flex flex-row gap-5 text-xl font-sans shrink-0 font-semibold`}
		>
			{children}
		</ul>
	);
}

function ListChild({ children }) {
	return (
		<ul className="shadow-md bg-primary-color flex flex-col gap-3 pt-4 pb-2 pl-4 pr-4 text-base font-normal absolute rounded-sm transition-all origin-top scale-y-0 group-hover:scale-y-100">
			{children}
		</ul>
	);
}
