'use client';
import { VerticalDivider } from '@/components/Extras';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MangaDetails({ params }) {
	const [manga, setManga] = useState([]);
	const [mangaChar, setMangaChar] = useState([]);
	const [placeholderImg, setPlaceholderImg] = useState('animated-background');
	const [activateModal, setActiveModal] = useState(false);
	const [mangaExistInList, setMangaExist] = useState(false);

	async function fetchManga() {
		const url = 'https://api.jikan.moe/v4/manga/';
		const queryParams = new URLSearchParams({
			sfw: true,
		});

		try {
			const [response, responseChar] = await Promise.all([
				fetch(url + params.id + '?' + queryParams),
				fetch(url + params.id + '/characters'),
			]);

			const resJson = await response.json();
			const resCharJson = await responseChar.json();
			await checkIfMangaInList(resJson.data.mal_id);
			setManga(resJson.data);
			setMangaChar(resCharJson.data);
		} catch (error) {
			setManga({});
		}
	}

	async function addToList() {
		if (localStorage.getItem('logged_in')) {
			const url = 'http://otakulibrary.runasp.net/api/MangaList/add';
			try {
				await fetch(url, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						id: manga?.mal_id,
						title: manga?.title_english || manga?.title,
						readStatus: 'Reading',
						imgUrl: manga?.images?.webp.large_image_url,
					}),
				});

				setMangaExist(true);
			} catch (error) {
				console.error(error);
			}

			return;
		}

		setActiveModal(true);
	}

	async function checkIfMangaInList(id) {
		const url = `http://otakulibrary.runasp.net/api/MangaList/${id}`;

		try {
			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			const resJson = await response.json();

			if (resJson.length !== 0) setMangaExist(true);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		fetchManga();
	}, []);

	return (
		<main className="flex flex-col gap-10 padding-base mt-7 mb-20 grow">
			{activateModal && <SignInModal onClick={() => setActiveModal(false)} />}

			{/* Manga image */}
			<section className="flex gap-9">
				<div className={`flex flex-col shrink-0 gap-5 ${placeholderImg}`}>
					<img
						className="shadow-lg rounded-lg"
						src={manga?.images?.webp.large_image_url}
						alt={manga?.title_english || manga?.title}
						onLoad={() => setPlaceholderImg('')}
					/>
					{mangaExistInList ? (
						<p className="p-3 text-xl text-center shadow-md rounded-lg cursor-default bg-blue-700 text-white transition-all hover:bg-blue-800">
							Manga is already added
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

				{/* Details about the manga */}
				<article className="mt-1">
					{/* Title */}
					<div>
						<p className="text-shadow-light text-3xl font-semibold">
							{manga?.title_english || manga?.title}
						</p>
						<p className="text-shadow-light text-lg">{manga?.title}</p>
						<p className="text-shadow-light text-lg">
							{manga?.title_japanese}
						</p>
					</div>

					{/* Synopsis */}
					<div className="mt-3 flex flex-col gap-1">
						<h1 className="text-2xl font-semibold text-shadow-light">
							Synopsis
						</h1>
						<p className="">{manga?.synopsis}</p>
					</div>

					{/* Genres */}
					<div>
						<h1 className="mt-3 mb-2 text-lg font-semibold text-shadow-light">
							Genres:
						</h1>
						<ul className="flex gap-3 flex-wrap">
							{manga?.genres?.map((genre, i) => {
								return (
									<li
										className="shadow-md p-1 pl-2 pr-2 bg-gray-200 rounded-lg text-shadow-light cursor-default"
										key={i}
									>
										{genre.name}
									</li>
								);
							})}
							{manga?.themes?.map((theme, i) => {
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

			{/* Section for rating, rank, episodes, and creator */}
			<section className="flex justify-around items-center">
				<div className="flex flex-col items-center pt-2 pb-2">
					Volumes: {manga?.volumes || manga?.status}
					<span>Chapters: {manga?.chapters || 'Unknown'}</span>
				</div>
				<VerticalDivider />
				<div className="flex flex-col items-center pt-2 pb-2">
					Rating:
					<span>{manga?.score}⭐ out of 10⭐</span>
				</div>
				<VerticalDivider />
				<div className="pt-2 pb-2">
					<span>{manga && manga.authors && manga.authors[0].name}</span>
				</div>
				<VerticalDivider />
				<div className="pt-2 pb-2">
					<Link
						href={'/top/manga'}
						className="transition-all hover:text-blue-500"
					>
						Rank #{manga?.rank || 'Unknown'}
					</Link>
				</div>
			</section>

			{/* Characters */}
			<section className="border-y-2 pl-10 pr-10 pt-5 pb-5 border-gray-300 bg-gray-600 bg-opacity-10">
				<p className="text-2xl font-semibold text-shadow-light text-center mb-5">
					Characters
				</p>
				<div className="overflow-auto">
					<ul className="flex gap-3 w-max">
						{mangaChar?.map((char, i) => {
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
