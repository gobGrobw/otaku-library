'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TopManga() {
	const [topManga, setTopManga] = useState([]);
	const [page, setPage] = useState({
		currentPage: 1,
		hasNextPage: true,
	});
	const [placeholderImg, setPlaceholderImg] = useState('animated-background');

	async function fetchTopManga() {
		const url = 'https://api.jikan.moe/v4/top/manga';
		const queryParams = new URLSearchParams({
			sfw: true,
			page: page.currentPage,
		});

		try {
			const response = await fetch(url + '?' + queryParams);
			const resJson = await response.json();
			setPage({ ...page, hasNextPage: resJson.pagination.has_next_page });
			setTopManga(resJson.data);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		fetchTopManga();
	}, [page.currentPage]);

	return (
		<main className="padding-base mt-5 mb-14 grow">
			<h1 className="font-semibold text-shadow-light text-3xl mb-5 text-center">
				Top manga of all time
			</h1>
			<ul className="flex flex-col gap-5 striped">
				{topManga?.map((manga, i) => {
					return (
						<li
							className="flex items-center w-full pl-10 pr-10 group"
							key={i}
						>
							<h1 className="text-2xl font-thin w-12">{manga.rank}</h1>
							<Link
								href={`/manga/${manga.mal_id}`}
								className="flex items-center w-full"
							>
								<div
									className={`overflow-hidden rounded-lg pr-10 ${placeholderImg}`}
								>
									<img
										className="object-cover w-20 h-28 rounded-lg transition-all group-hover:scale-105"
										src={manga.images.webp.image_url}
										alt={manga.title_english || manga.title}
										onLoad={() => setPlaceholderImg('')}
									/>
								</div>
								<section className="flex flex-col">
									<h1 className="text-shadow-light transition-all group-hover:text-blue-700">
										{manga.title_english || manga.title}
									</h1>
									<p className="text-gray-700 text-sm">
										Chapter: {manga.chapters || '?'} | Type:{' '}
										{manga.type || '?'} | Status:{' '}
										{manga.status || '?'}
									</p>
								</section>
							</Link>
							<p>⭐{manga.score}</p>
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
