import { Camera } from "lucide-react";

export default function LandingPageSidebar({ onPhotoSelected }: { onPhotoSelected: (img: HTMLImageElement) => void }) {
	function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		const img = new Image();
		img.onload = () => onPhotoSelected(img);
		img.src = URL.createObjectURL(file);
	}

	return (
		<section className="p-4 md:p-5 w-full flex flex-col gap-4">
			<article>
				<h1 className="text-2xl lg:text-4xl font-semibold mb-3">LKMM Twibbon</h1>
				<p className="text-base md:text-xl">Ayo pasang twibbon LKMM sekarang dan ramaikan sosial media kalian!</p>
			</article>
			<div className="*:cursor-pointer bg-purple-700 p-4 md:p-5 relative text-white rounded-xl w-fit">
				<input onChange={handleUpload} accept="image/png, image/jpeg, image/jpg, image/svg, image/webp" type="file" className="absolute inset-0 z-10 opacity-0" />
				<h3 className="flex items-center gap-3 font-semibold">
					<Camera />
					Upload your photo
				</h3>
			</div>
		</section>
	);
}
