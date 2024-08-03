'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TopAnime() {
	const [topAnime, setTopAnime] = useState([]);
	const [page, setPage] = useState({
		currentPage: 1,
		hasNextPage: true,
	});
	const [placeholderImg, setPlaceholderImg] = useState('animated-background');

	async function fetchTopAnime() {
		const url = 'https://api.jikan.moe/v4/top/anime';
		const queryParams = new URLSearchParams({
			sfw: true,
			page: page.currentPage,
		});

		try {
			const response = await fetch(url + '?' + queryParams);
			const resJson = await response.json();
			setPage({ ...page, hasNextPage: resJson.pagination.has_next_page });
			setTopAnime(resJson.data);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		fetchTopAnime();
	}, [page.currentPage]);

	return (
		<main className="padding-base mt-5 mb-14 grow">
			<h1 className="font-semibold text-shadow-light text-3xl mb-5 text-center">
				Top anime of all time
			</h1>
			<ul className="flex flex-col gap-5 striped">
				{topAnime?.map((anime, i) => {
					return (
						<li
							className="flex items-center w-full pl-10 pr-10 group"
							key={i}
						>
							<h1 className="text-2xl font-thin w-12">{anime.rank}</h1>
							<Link
								href={`/anime/${anime.mal_id}`}
								className="flex items-center w-full"
							>
								<div
									className={`overflow-hidden rounded-lg pr-10 ${placeholderImg}`}
								>
									<img
										className="object-cover w-20 h-28 rounded-lg transition-all group-hover:scale-105"
										src={anime.images.webp.image_url}
										alt={anime.title_english || anime.title}
										onLoad={() => setPlaceholderImg('')}
									/>
								</div>
								<section className="flex flex-col">
									<h1 className="text-shadow-light transition-all group-hover:text-blue-700">
										{anime.title_english || anime.title}
									</h1>
									<p className="text-gray-700 text-sm">
										Episode: {anime.episodes || '?'} | Type:{' '}
										{anime.type || '?'} | Status:{' '}
										{anime.status || '?'}
									</p>
								</section>
							</Link>
							<p>⭐{anime.score}</p>
						</li>
					);
				})}
			</ul>

			{/* Pagination */}
			<nav className="flex gap-5 justify-end items-center mt-2">
				{page.currentPage == 1 ? (
					''
				) : (
					<button
						onClick={() =>
							setPage({
								...page,
								currentPage: page.currentPage - 1,
							})
						}
						className="transition-all hover:text-blue-500"
					>
						&lt; Previous Page
					</button>
				)}
				{page.hasNextPage && (
					<button
						onClick={() =>
							setPage({
								...page,
								currentPage: page.currentPage + 1,
							})
						}
						className="transition-all hover:text-blue-500"
					>
						Next Page &gt;
					</button>
				)}
			</nav>
		</main>
	);
}
