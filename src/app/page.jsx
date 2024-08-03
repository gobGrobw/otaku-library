import NavigationBar from '@/components/NavigationBar';
import SearchBar from '@/components/SearchBar';
import TopAnimeMangaSection from '@/components/Section';

export default function Home() {
	return (
		<>
			<NavigationBar />
			<header className="h-2/5 text-white img bg-cover bg-center bg-no-repeat mb-14 shrink-0">
				<section className="h-full flex flex-col justify-center items-center">
					<label className="text-6xl font-semibold mb-10 text-shadow">
						Otaku's Library
					</label>

					{/* Search form */}
					<div className="w-3/6">
						<SearchBar />
					</div>
				</section>
			</header>

			{/* Top anime and manga section */}
			<div>
				<TopAnimeMangaSection />
			</div>
		</>
	);
}

