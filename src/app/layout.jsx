import './globals.css';
import LayoutProvider from '@/components/LayoutProvider';

export const metadata = {
	title: "Otaku's Library",
	description: 'A library of animes and mangas',
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.png" />
				<meta
					http-equiv="Content-Security-Policy"
					content="upgrade-insecure-requests"
				/>
			</head>
			<body className="flex flex-col">
				<LayoutProvider>{children}</LayoutProvider>
			</body>
		</html>
	);
}

