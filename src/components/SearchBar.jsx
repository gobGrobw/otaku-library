'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';

export default function SearchHeader() {
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResult, setSearchResult] = useState({});
	const [disableResult, setDisableResult] = useState(false);

	async function fetchSearch(fetchManga = false) {
		try {
			const queryParams = new URLSearchParams({
				limit: 5,
				q: searchTerm,
				sfw: true,
			});

			const url = 'https://api.jikan.moe/v4/';
			const uri = fetchManga ? 'manga?' : 'anime?';

			const response = await fetch(url + uri + queryParams);
			const resJson = await response.json();
			return resJson.data;
		} catch (error) {
			console.error(error);
		}
	}

	async function fetchResult() {
		const [anime, manga] = await Promise.all([fetchSearch(), fetchSearch(true)]);

		setSearchResult({
			anime: anime,
			manga: manga,
		});
	}

	useEffect(() => {
		if (searchTerm === '') return setSearchResult({}); // Dont do the following function if its empty
		// Fetch the data when the user hasnt typed for 1.2 second
		const delayFn = setTimeout(async () => {
			fetchResult();
		}, 1200);

		return () => clearTimeout(delayFn);
	}, [searchTerm]);

	return (
		<form
			action="#"
			className="w-full flex flex-row justify-center items-center gap-2"
			onBlur={() => setDisableResult(true)}
			onFocus={() => setDisableResult(false)}
		>
			<div className="relative w-3/6 z-10 grow">
				<input
					className="w-full h-full pt-2 pb-2 pl-5 pr-5 rounded-t-md bg-gray-700 shadow-2xl border-2 border-gray-500 border-b-0"
					type="text"
					placeholder="Search any anime and manga..."
					onChange={(e) => {
						setSearchTerm(e.target.value);
					}}
				/>
				<ul
					className={`absolute w-full bg-gray-700 rounded-b-md border-2 border-gray-500 border-t-0 ${
						disableResult && 'h-0 overflow-hidden'
					}`}
				>
					{searchTerm === '' ? (
						''
					) : (
						<div className="flex items-center gap-3">
							<p className="pl-3 p-1">
								Searching for{' '}
								<span className="font-semibold underline">
									{searchTerm}
								</span>
							</p>
							{Object.keys(searchResult).length == 0 ? (
								<img
									className="w-5 h-5 object-cover"
									src="https://i.gifer.com/ZKZg.gif"
									alt="Loading gif"
								/>
							) : (
								''
							)}
						</div>
					)}

					{/* Show anime result */}
					<SearchList array={searchResult.anime} path={'anime'} />

					{/* Show manga result */}
					<SearchList array={searchResult.manga} path={'manga'} />
				</ul>
			</div>

			{/* Search button */}
			<Link
				href={'#'}
				className="w-auto h-full flex justify-center items-center transition-all pt-2 pb-2 pl-5 pr-5 rounded-lg text-white bg-blue-800 hover:bg-blue-700 hover:scale-105"
			>
				<FaMagnifyingGlass size={20} />
			</Link>
		</form>
	);
}

function SearchList({ array, path }) {
	return (
		<ul>
			{array === undefined ? (
				''
			) : (
				<p className="pl-3 bg-gray-600">
					{path.slice(0, 1).toUpperCase() + path.slice(1)}
				</p>
			)}
			{array?.map((entry, i) => {
				const title = entry.title_english || entry.title;
				return (
					<Link href={`/${path}/${entry.mal_id}`} key={i}>
						<li className="flex items-center pl-3 pr-3 pt-1 pb-1 gap-3 transition-all hover:bg-gray-600">
							<img
								className="object-cover w-8 h-10 rounded-sm"
								src={entry.images.webp.small_image_url}
								alt={title}
							/>
							<section>
								<h1>{title}</h1>
								<p className="text-gray-300 text-sm">
									Score: {entry.score || '?'} | Episode:{' '}
									{entry.episodes || '?'} | Type:{' '}
									{entry.type || '?'} | Status:{' '}
									{entry.status || '?'}
								</p>
							</section>
						</li>
					</Link>
				);
			})}
		</ul>
	);
}
