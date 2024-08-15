'use client';
import SignInModal, { VerticalDivider } from '@/components/SignInModal';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AnimeDetails({ params }) {
	const [anime, setAnime] = useState([]);
	const [animeChar, setAnimeChar] = useState([]);
	const [placeholderImg, setPlaceholderImg] = useState('animated-background');
	const [activateModal, setActiveModal] = useState(false);
	const [animeExistInList, setAnimeExist] = useState(false);

	async function fetchAnime() {
		const url = 'https://api.jikan.moe/v4/anime/';
		const queryParams = new URLSearchParams({
			sfw: true,
		});

		try {
			const [response, responseChar] = await Promise.all([
				fetch(url + params.id + '?' + queryParams),
				fetch(url + params.id + '/characters'),
			]);

			const resJson = await response.json();
			const resJsonChar = await responseChar.json();
			await checkIfAnimeInList(resJson.data.mal_id);

			// Returns an object
			setAnime(resJson.data);
			setAnimeChar(resJsonChar.data);
		} catch (error) {
			console.error(error);
		}
	}

	async function addToList() {
		if (localStorage.getItem('logged_in')) {
			const url = 'http://otakulibrary.runasp.net/api/AnimeList/add';
			try {
				await fetch(url, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						id: anime?.mal_id,
						title: anime?.title_english || anime?.title,
						watchStatus: 'Watching',
						imgUrl: anime?.images?.webp.large_image_url,
					}),
				});

				setAnimeExist(true);
			} catch (error) {
				console.error(error);
			}

			return;
		}

		setActiveModal(true);
	}

	async function checkIfAnimeInList(id) {
		const url = `http://otakulibrary.runasp.net/api/AnimeList/${id}`;

		try {
			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			const resJson = await response.json();

			if (resJson.length !== 0) setAnimeExist(true);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		fetchAnime();
	}, []);

	return (
		<main className="flex flex-col gap-10 padding-base mt-7 mb-20 grow">
			{activateModal && <SignInModal onClick={() => setActiveModal(false)} />}

			{/* Anime image */}
			<section className="flex gap-9">
				<div className={`flex flex-col shrink-0 phone:w-2/6 gap-5 ${placeholderImg}`}>
					<img
						className="shadow-lg rounded-lg"
						src={anime?.images?.webp.large_image_url}
						alt={anime?.title_english || anime?.title}
						onLoad={() => setPlaceholderImg('')}
					/>
					{animeExistInList ? (
						<p className="p-3 text-xl text-center shadow-md rounded-lg cursor-default bg-blue-700 text-white transition-all hover:bg-blue-800">
							Anime is already added
						</p>
					) : (
						<button
							onClick={addToList}
							className="p-3 text-xl shadow-md rounded-lg bg-blue-700 text-white transition-all hover:bg-blue-800"
						>
							&#43; Add to List
						</button>
					)}
				</div>

				{/* Details about the anime */}
				<article className="mt-1">
					{/* Title */}
					<div>
						<p className="text-shadow-light text-3xl font-semibold">
							{anime?.title_english || anime?.title}
						</p>
						<p className="text-shadow-light text-lg">{anime?.title}</p>
						<p className="text-shadow-light text-lg">
							{anime?.title_japanese}
						</p>
					</div>

					{/* Synopsis */}
					<div className="mt-3 flex flex-col gap-1">
						<h1 className="text-2xl font-semibold text-shadow-light">
							Synopsis
						</h1>
						<p className="">{anime?.synopsis}</p>

						<p className="text-lg mt-2">
							Premiered:{' '}
							<Link
								href={{
									pathname: '/seasonal',
									query: {
										season: anime?.season,
										year: anime?.year,
									},
								}}
								className="text-shadow-light transition-all text-blue-500 hover:text-blue-700"
							>
								{anime?.season?.slice(0, 1).toUpperCase() +
									anime?.season?.slice(1) || 'Unknown'}{' '}
								{anime?.year}
							</Link>
						</p>
					</div>

					{/* Genres */}
					<div>
						<h1 className="mt-3 mb-2 text-lg font-semibold text-shadow-light">
							Genres:
						</h1>
						<ul className="flex gap-3 flex-wrap">
							{anime?.genres?.map((genre, i) => {
								return (
									<li
										className="shadow-md p-1 pl-2 pr-2 bg-gray-200 rounded-lg text-shadow-light cursor-default"
										key={i}
									>
										{genre.name}
									</li>
								);
							})}
							{anime?.themes?.map((theme, i) => {
								return (
									<li
										className="shadow-md p-1 pl-2 pr-2 bg-gray-200 rounded-lg text-shadow-light cursor-default"
										key={i}
									>
										{theme.name}
									</li>
								);
							})}
						</ul>
					</div>
				</article>
			</section>

			{/* Section for rating, rank, episodes, and studios */}
			<section className="flex justify-around items-center">
				<div className="flex flex-col items-center pt-2 pb-2">
					Episodes: {anime?.episodes || anime?.status}
					<span>Duration: {anime?.duration || 'Unknown'}</span>
				</div>
				<VerticalDivider />
				<div className="flex flex-col items-center pt-2 pb-2">
					Rating:
					<span>{anime?.score}⭐ out of 10⭐</span>
				</div>
				<VerticalDivider />
				<div className="pt-2 pb-2">
					<span>
						{(anime?.studios &&
							anime?.studios[0] &&
							anime?.studios[0].name) ||
							'Unknown'}
					</span>
				</div>
				<VerticalDivider />
				<div className="pt-2 pb-2 transition-all hover:text-blue-500">
					<Link href={'/top/anime'}>Rank #{anime?.rank || 'Unknown'}</Link>
				</div>
			</section>

			{/* Trailer */}
			<section className="flex flex-col justify-center items-center">
				{anime?.trailer?.embed_url === null ? (
					<p className="text-lg">No trailer found for this anime</p>
				) : (
					<embed
						width="100%"
						height="600"
						src={anime?.trailer?.embed_url}
					/>
				)}
			</section>

			{/* Characters */}
			<section className="border-y-2 pl-10 pr-10 pt-5 pb-5 border-gray-300 bg-gray-600 bg-opacity-10">
				<p className="text-2xl font-semibold text-shadow-light text-center mb-5">
					Characters
				</p>
				<div className="overflow-auto">
					<ul className="flex gap-3 w-max">
						{animeChar?.map((char, i) => {
							const character = char.character;
							return (
								<li key={i} className="w-28 mb-2">
									<img
										className="object-cover w-28 h-44 rounded-lg shadow-lg"
										src={character.images.webp.image_url}
										alt={character.name}
									/>
									<p className="mt-1 text-shadow-light">
										{character.name}
									</p>
								</li>
							);
						})}
					</ul>
				</div>
			</section>
		</main>
	);
}
