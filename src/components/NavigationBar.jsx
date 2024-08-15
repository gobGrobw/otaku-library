'use client';
import { IoIosMenu } from 'react-icons/io';
import { FaMagnifyingGlass } from 'react-icons/fa6';

import Link from 'next/link';
import SearchHeader from './SearchBar';
import { useEffect, useState } from 'react';

const linkClassName = 'text-shadow-light transition-all hover:text-blue-500';

export default function NavigationBar({ enableSearchBar = false }) {
	const [isLogged, setLogged] = useState(false);

	useEffect(() => {
		if (typeof window !== undefined) {
			setLogged(localStorage.getItem('logged_in') || false);
		}
	}, []);

	return (
		<nav className="h-14 flex flex-row items-center justify-between text-primary-font-color phone:relative bg-primary-color shadow-lg padding-base pt-2 pb-2">
			{/* Navigation link to anime and manga list */}
			<div className="flex justify-center items-center gap-7">
				<Link href={'/'} className="flex shrink-0">
					<img className="h-10 w-h-10" src="/favicon.png" alt="alya" />
				</Link>
				{/* Anime dropdown menu */}
				<List>
					<CategoryDropdown title={'Anime'}>
						<Link className={linkClassName} href={'/'}>
							Browse Anime
						</Link>
						<Link className={linkClassName} href={'/top/anime'}>
							Top Anime
						</Link>
						<Link className={linkClassName} href={'/seasonal'}>
							Seasonal Anime
						</Link>
					</CategoryDropdown>

					{/* Manga dropdown menu */}
					<CategoryDropdown title={'Manga'}>
						<Link className={linkClassName} href={'/'}>
							Browse Manga
						</Link>
						<Link className={linkClassName} href={'/top/manga'}>
							Top Manga
						</Link>
					</CategoryDropdown>
				</List>
			</div>

			{enableSearchBar && <NavSearchBar />}

			{/* Authentication link */}
			<AuthMenu isLogged={isLogged} />
		</nav>
	);
}

function NavSearchBar() {
	const [showSearchBar, setShowSearchBar] = useState(false);

	return (
		<>
			<button
				className="absolute opacity-0 phone:static phone:opacity-100"
				onClick={() => {
					setShowSearchBar(!showSearchBar);
				}}
				onBlur={() => {
					setShowSearchBar(false);
				}}
			>
				<FaMagnifyingGlass size={25} />
			</button>
			<div
				className={`w-full ml-10 mr-10 phone:ml-0 phone:mr-0 phone:absolute phone:top-[55px] phone:left-0 phone:w-[100vw] phone:bg-white ${
					!showSearchBar && 'phone:overflow-hidden phone:h-0'
				}`}
			>
				<div
					className={`flex grow phone:ml-3 phone:mr-3 text-white phone:transition phone:pt-3 phone:pb-3 phone:-translate-y-full ${
						showSearchBar && 'phone:translate-y-0'
					}`}
				>
					<SearchHeader />
				</div>
			</div>
		</>
	);
}

function AuthMenu({ isLogged }) {
	const [showNav, setShowNav] = useState(false);

	return (
		<ul className="flex flex-row gap-5 text-xl font-sans shrink-0 font-semibold phone:flex-col">
			<button className="absolute opacity-0 phone:static phone:opacity-100">
				<IoIosMenu
					size={25}
					onClick={() => {
						setShowNav(!showNav);
					}}
					onBlur={() => {
						setShowNav(false);
					}}
				/>
			</button>
			<div
				className={`phone:overflow-hidden phone:absolute phone:top-[55px] phone:left-0 phone:w-full ${
					!showNav && 'phone:h-0'
				}`}
			>
				<ul
					className={`flex gap-5 phone:flex phone:flex-row phone:transition phone:pt-2 phone:gap-10 phone:pb-2 phone:justify-center phone:items-center phone:bg-white phone:-translate-y-full ${
						showNav && 'phone:translate-y-0'
					}`}
				>
					{isLogged ? (
						<Link
							className="font-trebuchet font-bold text-xl p-1 pl-3 pr-3 rounded-md text-white bg-blue-800 text-center transition-all hover:bg-blue-700"
							href={'/dashboard'}
						>
							Dashboard
						</Link>
					) : (
						<>
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
						</>
					)}
				</ul>
			</div>
		</ul>
	);
}

function CategoryDropdown({ children, title }) {
	const [showCategory, setShowCategory] = useState(false);

	return (
		<button
			className="group z-20"
			onClick={() => {
				setShowCategory(!showCategory);
			}}
			onBlur={() => {
				setShowCategory(false);
			}}
		>
			<span className="cursor-default">{title}</span>
			<ListChild open={showCategory}>{children}</ListChild>
		</button>
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

function ListChild({ children, open }) {
	return (
		<ul
			className={`shadow-md bg-primary-color flex flex-col gap-3 pt-4 pb-2 pl-4 pr-4 text-base text-start font-normal absolute rounded-sm transition-all origin-top scale-y-0 group-hover:scale-y-100 ${
				open && 'scale-y-100'
			}`}
		>
			{children}
		</ul>
	);
}
