'use client';
import { UlList } from '@/components/Section';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SeasonalPage() {
	const [seasonalAnime, setSeasonalAnime] = useState([]);
	const searchParams = useSearchParams();
	let seasonSearch = {
		season: searchParams.get('season'),
		year: searchParams.get('year'),
	};

	async function fetchSeasonalAnime(
		seasonSearch = {
			season: null,
			year: null,
		}
	) {
		const url =
			seasonSearch.season && seasonSearch.year
				? `https://api.jikan.moe/v4/seasons/${seasonSearch.year}/${seasonSearch.season}`
				: 'https://api.jikan.moe/v4/seasons/now';

		const queryParams = new URLSearchParams({
			sfw: true,
		});

		try {
			const [response, secondResponse] = await Promise.all([
				fetch(url + '?' + queryParams),
				fetch(url + '?' + queryParams + '&page=2'),
			]);

			const resJson = await response.json();
			const resSecJson = await secondResponse.json();
			setSeasonalAnime([...resJson.data, ...resSecJson.data]);
		} catch (error) {
			console.error(error);
		}
	}

	function onSubmit(e) {
		e.preventDefault();

		const formData = new FormData(e.target);
		seasonSearch = {
			season: formData.get('season'),
			year: formData.get('year'),
		};

		fetchSeasonalAnime(seasonSearch);
	}

	useEffect(() => {
		fetchSeasonalAnime(seasonSearch);
	}, []);

	return (
		<main className="padding-base mt-10 mb-14 grow">
			{/* Current season animes */}
			<section>
				<div className="flex flex-col justify-center items-center mb-10 gap-5">
					<h1 className="font-semibold text-center text-shadow-light text-3xl">
						{seasonalAnime[0]?.season.slice(0, 1).toUpperCase() +
							seasonalAnime[0]?.season.slice(1)}{' '}
						{seasonalAnime[0]?.year} Anime
					</h1>

					<form
						onSubmit={onSubmit}
						className="flex gap-5 justify-center items-center"
					>
						<select
							name="season"
							id="season"
							className="bg-transparent border-b-2 border-gray-600 pl-2 pb-1"
						>
							<option value="spring">Spring</option>
							<option value="summer">Summer</option>
							<option value="fall">Fall</option>
							<option value="winter">Winter</option>
						</select>

						<input
							className="bg-transparent border-b-2 border-gray-600 pl-2 pb-1"
							type="number"
							name="year"
							min={1960}
							max={new Date().getFullYear()}
							placeholder={new Date().getFullYear()}
						/>
						<button
							type="submit"
							className="bg-blue-700 text-white p-1 pl-2 pr-2 rounded-lg shadow-md transition-all hover:bg-blue-800"
						>
							Search
						</button>
					</form>
				</div>
				<UlList
					className={'grid grid-cols-8 justify-center gap-3 gap-y-10'}
					array={seasonalAnime}
				/>
			</section>
		</main>
	);
}
