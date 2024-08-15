'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function TopAnimeMangaSection() {
	const [topArray, setTopArray] = useState({});
	const hasFetched = useRef(false); // Make sure useEffect only fetch data once
	const url = 'https://api.jikan.moe/v4/';

	async function fetchSeasonalAnime() {
		try {
			const queryParams = new URLSearchParams({
				limit: 7,
				sfw: true,
			});

			const response = await fetch(url + 'seasons/now?' + queryParams);
			const resJson = await response.json();
			return resJson.data;
		} catch (error) {
			console.error(error);
		}
	}

	async function fetchTop(fetchManga = false) {
		try {
			const queryParams = new URLSearchParams({
				limit: 7,
				sfw: true,
			});
			const animeOrManga = fetchManga ? 'manga?' : 'anime?';

			const response = await fetch(url + 'top/' + animeOrManga + queryParams);

			const resJson = await response.json();
			return resJson.data;
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		if (hasFetched.current) return;
		async function fetchAnimeManga() {
			const [anime, manga, seasonal] = await Promise.all([
				fetchTop(false), // Fetch anime
				fetchTop(true), // Fetch manga
				fetchSeasonalAnime(), // Fetch seasonal anime
			]);

			setTopArray({
				anime: anime,
				manga: manga,
				seasonal: seasonal,
			});
		}

		fetchAnimeManga();
		hasFetched.current = true; // Set to true after fetching data
	}, []);

	return (
		<main className="flex flex-col justify-center items-center gap-16 mb-14">
			{/* Seasonal anime */}
			<section className="flex flex-col justify-center items-center gap-3">
				<h1 className="text-3xl font-sans mb-6 font font-semibold">
					Seasonal anime series
				</h1>

				<div className="overflow-auto phone:w-[95dvw] phone:my-3 phone:py-2">
					<UlList
						className={'flex gap-3 gap-y-10'}
						array={topArray.seasonal}
					/>
				</div>
				<ButtonLink href={'/seasonal'}>Browse seasonal anime</ButtonLink>
			</section>

			{/* List of popular animes this week */}
			<section className="flex flex-col justify-center items-center gap-3 border-y-2 pl-10 pr-10 pt-5 pb-5 border-gray-300 bg-gray-600 bg-opacity-10">
				<h1 className="text-3xl font-sans mb-6 font font-semibold">
					Popular anime series
				</h1>
				<div className="overflow-auto phone:w-[95dvw] phone:my-3 phone:py-2">
					<UlList
						className={'flex gap-3 gap-y-10'}
						array={topArray.anime}
					/>
				</div>
				<ButtonLink href={'/top/anime'}>Browse top anime</ButtonLink>
			</section>

			{/* List of popular mangas this week */}
			<section className="flex flex-col justify-center items-center gap-3">
				<h1 className="text-3xl font-sans mb-6 font font-semibold">
					Popular manga series
				</h1>

				<div className="overflow-auto phone:w-[95dvw] phone:my-3 phone:py-2">
					<UlList
						className={'flex gap-3 gap-y-10'}
						array={topArray.manga}
						isManga
					/>
				</div>
				<ButtonLink href={'/top/manga'}>Browse top manga</ButtonLink>
			</section>
		</main>
	);
}

export function UlList({ array, isManga = false, className }) {
	const [placeholderImg, setPlaceholderImg] = useState('animated-background');
	const path = isManga ? 'manga' : 'anime';
	return (
		<ul className={className}>
			{array?.map((entry, i) => {
				return (
					<Link href={`/${path}/${entry.mal_id}`} key={i}>
						<li className="w-36 group">
							<div
								className={`overflow-hidden rounded-lg shadow-lg ${placeholderImg}`}
							>
								<img
									className="object-cover w-36 h-52 rounded-lg transition-all group-hover:scale-105"
									src={entry.images.webp.image_url}
									alt={entry.title_english}
									onLoad={() => setPlaceholderImg('')}
								/>
							</div>
							<p className="text-shadow-light text-center transition-all group-hover:text-blue-700">
								{entry.title_english?.slice(0, 45) ||
									entry.title?.slice(0, 45)}
								{entry.title_english?.length <= 45 || '...'}
							</p>
						</li>
					</Link>
				);
			})}
		</ul>
	);
}

function ButtonLink({ children, href }) {
	return (
		<Link
			className="font-trebuchet font-bold text-xl pt-1 pb-1 pl-3 pr-3 rounded-md text-white bg-blue-800 text-center transition-all hover:bg-blue-700"
			href={href}
		>
			{children}
		</Link>
	);
}
