'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
	const [view, setView] = useState('anime');
	const router = useRouter();

	useEffect(() => {
		// Only logged in user can access this route
		if (typeof window !== undefined && !localStorage.getItem('logged_in')) {
			console.log(localStorage.getItem('logged_in'));
			return router.push('/sign-up');
		}
	}, []);

	return (
		<main className="grow flex flex-col justify-between mt-5 padding-base">
			<nav className="flex justify-center items-center gap-10 mb-7">
				<button
					onClick={() => {
						setView('anime');
					}}
					className={`transition-all text-shadow-light text-lg ${
						view == 'anime'
							? 'hover:bg-blue-950  bg-blue-700 p-1 pl-3 pr-3 rounded-lg text-white'
							: 'hover:text-blue-500'
					}  font-semibold`}
				>
					Anime
				</button>
				<button
					onClick={() => {
						setView('manga');
					}}
					className={`transition-all text-shadow-light text-lg ${
						view == 'manga'
							? 'hover:bg-blue-950  bg-blue-700 p-1 pl-3 pr-3 rounded-lg text-white'
							: 'hover:text-blue-500'
					}  font-semibold`}
				>
					Manga
				</button>
			</nav>

			{view == 'anime' ? <AnimeSection /> : <MangaSection />}
		</main>
	);
}

function AnimeSection() {
	const [list, setList] = useState([]);
	const [placeholderImg, setPlaceholderImg] = useState('animated-background');

	async function fetchAnimeList() {
		const url = `http://otakulibrary.runasp.net/api/AnimeList/all`;

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});

			const resJson = await response.json();
			setList(resJson);
		} catch (error) {
			console.error(error);
		}
	}

	async function updateStatus(id, value) {
		const url = 'http://otakulibrary.runasp.net/api/AnimeList/update';

		try {
			const payload = list.payload.filter((x) => x.id === id)[0];
			payload.watchStatus = value;

			await fetch(url, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			fetchAnimeList();
		} catch (error) {
			console.error(error);
		}
	}

	async function removeFromList(id) {
		const url = `http://otakulibrary.runasp.net/api/AnimeList/delete/${id}`;

		try {
			await fetch(url, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json',
				},
			});

			fetchAnimeList();
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		fetchAnimeList();
	}, []);

	return (
		<section className="grow flex flex-col gap-10 w-full">
			<div className="flex flex-col items-center gap-2">
				<div>
					<h1 className="text-center text-shadow-light text-2xl font-semibold justify-around">
						Anime stats
					</h1>
					<p className="text-center text-lg">
						Total anime in your list: {list?.count || 0}
					</p>
				</div>
				<hr className="mb-2 border-gray-600 w-4/5" />
				<ul className="text-lg grid grid-cols-2 gap-x-12 w-2/5">
					<li className="flex gap-11 justify-between">
						Completed <span>{list?.completed || 0}</span>
					</li>
					<li className="flex gap-11 justify-between">
						Watching <span>{list?.watching || 0}</span>
					</li>
					<li className="flex gap-11 justify-between">
						Planned <span>{list?.planned || 0}</span>
					</li>
					<li className="flex gap-11 justify-between">
						Dropped <span>{list?.dropped || 0}</span>
					</li>
				</ul>
			</div>

			<section className="grow mb-10 gap-3 border-y-2 pl-10 pr-10 pt-5 pb-5 border-gray-300 bg-gray-600 bg-opacity-10 overflow-auto">
				<ul className="flex flex-col gap-5 w-full">
					{list?.payload?.map((anime, i) => {
						return (
							<li
								className="flex items-center w-full group mr-5 ml-1"
								key={i}
							>
								<h1 className="text-2xl font-semibold w-12 text-center mr-2">
									{i + 1}.
								</h1>
								<Link
									href={`/anime/${anime.id}`}
									className="flex items-center w-full gap-10"
								>
									<div
										className={`overflow-hidden rounded-lg ${placeholderImg}`}
									>
										<img
											className="object-cover w-14 h-20 rounded-lg transition-all group-hover:scale-105"
											src={anime.imgUrl}
											alt={anime.title}
											onLoad={() => setPlaceholderImg('')}
										/>
									</div>
									<p className="group-hover:text-blue-500 transition-all break-words w-3/4">
										{anime.title}
									</p>
								</Link>
								<div className="flex gap-5">
									<select
										name="watchStatus"
										id="watchStatus"
										className="bg-transparent border-b-2 border-gray-600"
										value={anime.watchStatus}
										onChange={(e) => {
											updateStatus(anime.id, e.target.value);
										}}
									>
										<option value="Watching">Watching</option>
										<option value="Completed">Completed</option>
										<option value="Dropped">Dropped</option>
										<option value="Planned">Planned</option>
									</select>

									<button
										onClick={() => removeFromList(anime.id)}
										className="transition-all hover:text-blue-500 text-shadow-light"
									>
										Remove
									</button>
								</div>
							</li>
						);
					})}
				</ul>
			</section>
		</section>
	);
}

function MangaSection() {
	const [list, setList] = useState([]);
	const [placeholderImg, setPlaceholderImg] = useState('animated-background');

	async function fetchMangaList() {
		const url = `http://otakulibrary.runasp.net/api/MangaList/all`;

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});

			const resJson = await response.json();
			setList(resJson);
		} catch (error) {
			console.error(error);
		}
	}

	async function updateStatus(id, value) {
		const url = 'http://otakulibrary.runasp.net/api/MangaList/update';

		try {
			const payload = list.payload.filter((x) => x.id === id)[0];
			payload.watchStatus = value;

			await fetch(url, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			fetchMangaList();
		} catch (error) {
			console.error(error);
		}
	}

	async function removeFromList(id) {
		const url = `http://otakulibrary.runasp.net/api/MangaList/delete/${id}`;

		try {
			await fetch(url, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json',
				},
			});

			fetchMangaList();
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		fetchMangaList();
	}, []);

	return (
		<section className="grow flex flex-col gap-10 w-full">
			<div className="flex flex-col items-center gap-2">
				<div>
					<h1 className="text-center text-shadow-light text-2xl font-semibold justify-around">
						Anime stats
					</h1>
					<p className="text-center text-lg">
						Total anime in your list: {list?.count || 0}
					</p>
				</div>
				<hr className="mb-2 border-gray-600 w-4/5" />
				<ul className="text-lg grid grid-cols-2 gap-x-12 w-2/5">
					<li className="flex gap-11 justify-between">
						Completed <span>{list?.completed || 0}</span>
					</li>
					<li className="flex gap-11 justify-between">
						Reading <span>{list?.reading || 0}</span>
					</li>
					<li className="flex gap-11 justify-between">
						Planned <span>{list?.planned || 0}</span>
					</li>
					<li className="flex gap-11 justify-between">
						Dropped <span>{list?.dropped || 0}</span>
					</li>
				</ul>
			</div>

			<section className="grow mb-10 gap-3 border-y-2 pl-10 pr-10 pt-5 pb-5 border-gray-300 bg-gray-600 bg-opacity-10 overflow-auto">
				<ul className="flex flex-col gap-5 w-full">
					{list?.payload?.map((manga, i) => {
						return (
							<li
								className="flex items-center w-full group mr-5 ml-1"
								key={i}
							>
								<h1 className="text-2xl font-semibold w-12 text-center mr-2">
									{i + 1}.
								</h1>
								<Link
									href={`/manga/${manga.id}`}
									className="flex items-center w-full gap-10"
								>
									<div
										className={`overflow-hidden rounded-lg ${placeholderImg}`}
									>
										<img
											className="object-cover w-14 h-20 rounded-lg transition-all group-hover:scale-105"
											src={manga.imgUrl}
											alt={manga.title}
											onLoad={() => setPlaceholderImg('')}
										/>
									</div>
									<p className="group-hover:text-blue-500 transition-all break-words w-3/4">
										{manga.title}
									</p>
								</Link>
								<div className="flex gap-5">
									<select
										name="readStatus"
										id="readStatus"
										className="bg-transparent border-b-2 border-gray-600"
										value={manga.readStatus}
										onChange={(e) => {
											updateStatus(manga.id, e.target.value);
										}}
									>
										<option value="Reading">Reading</option>
										<option value="Completed">Completed</option>
										<option value="Dropped">Dropped</option>
										<option value="Planned">Planned</option>
									</select>

									<button
										onClick={() => removeFromList(manga.id)}
										className="transition-all hover:text-blue-500 text-shadow-light"
									>
										Remove
									</button>
								</div>
							</li>
						);
					})}
				</ul>
			</section>
		</section>
	);
}
