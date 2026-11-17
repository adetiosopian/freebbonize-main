import { useState, useRef } from "react";
import "./App.css";
import TwibbonCanvas from "./components/twibbon-canvas";
import LandingPageSidebar from "./components/landing-page";
import AdjustPageSidebar from "./components/adjust-page";
import DownloadPageSidebar from "./components/download-page";

function App() {
	const [sidebarState, setSidebarState] = useState<"landing" | "adjust" | "ready">("landing");
	const [userPhoto, setUserPhoto] = useState<HTMLImageElement | null>(null);
	const [photoTransform, setPhotoTransform] = useState({ x: 0, y: 0, scale: 100, rotate: 0 });
	const canvasRef = useRef<HTMLCanvasElement>(null);

	function handlePhotoSelected(img: HTMLImageElement) {
		setUserPhoto(img);
		setSidebarState("adjust");
	}

	return (
		<main className="min-h-screen w-full flex justify-center items-start md:items-center bg-white">
			<div className="w-full max-w-5xl mx-auto flex md:flex-row flex-col md:gap-10 gap-6 p-4 md:p-8 md:py-10 py-6 items-start md:items-center">
				{/* Sidebar — tampil di atas di mobile, di kanan di desktop */}
				<section className="w-full md:hidden order-first">
					{sidebarState == "landing" && <LandingPageSidebar onPhotoSelected={handlePhotoSelected} />}
					{sidebarState == "adjust" && <AdjustPageSidebar onPhotoSelected={handlePhotoSelected} transform={photoTransform} setTransform={setPhotoTransform} onGenerate={setSidebarState} />}
					{sidebarState == "ready" && <DownloadPageSidebar canvas={canvasRef} />}
				</section>

				{/* Canvas twibbon */}
				<section className="w-full md:w-80 lg:w-96 mx-auto md:mx-0 max-w-xs md:max-w-none flex-shrink-0">
					<TwibbonCanvas userPhoto={userPhoto} frameSrc={"/twibbon.png"} transform={photoTransform} setTransform={setPhotoTransform} isEditMode={sidebarState == "adjust"} canvasRef={canvasRef} />
				</section>
				<span className="text-gray-100 text-center text-[4px] mt-4">selamat anda menemukan saya tio</span>
				{/* Sidebar — tampil di kanan di desktop */}
				<section className="hidden md:block flex-1 max-w-lg">
					{sidebarState == "landing" && <LandingPageSidebar onPhotoSelected={handlePhotoSelected} />}
					{sidebarState == "adjust" && <AdjustPageSidebar onPhotoSelected={handlePhotoSelected} transform={photoTransform} setTransform={setPhotoTransform} onGenerate={setSidebarState} />}
					{sidebarState == "ready" && <DownloadPageSidebar canvas={canvasRef} />}
				</section>
			</div>

		</main>
	);
}

export default App;
