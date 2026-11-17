import { useState } from "react";
import { ArrowDownToLine, SquarePen, Clipboard, ClipboardCheck } from "lucide-react";
import campaignData from "../campaign-data.json";

type CaptionType = Record<string, string>;
const { caption, props: captionProps } = campaignData;

function fillCaption(template: string, values: CaptionType) {
	return template.replace(/\[(\w+)\]/g, (_, key) => values[key]?.trim() || `[${key}]`);
}

export default function DownloadPageSidebar({ canvas }: { canvas: React.RefObject<HTMLCanvasElement | null> }) {
	const [isEdit, setIsEdit] = useState(false);
	const [captionValues, setCapValues] = useState<CaptionType>(() => Object.fromEntries(captionProps.map((key) => [key, ""])));
	const [isCopied, setIsCopied] = useState(false);

	const filledCaption = fillCaption(caption, captionValues);

	function handleDownloadCanvas(canvas: React.RefObject<HTMLCanvasElement | null>, filename: string) {
		if (!canvas.current) return;
		const dataUrl = canvas.current.toDataURL("image/png");
		const link = document.createElement("a");
		link.href = dataUrl;
		link.download = filename;
		link.click();
	}

	function handleCopyCaption() {
		setIsCopied(true);
		navigator.clipboard.writeText(filledCaption);
		setTimeout(() => {
			setIsCopied(false);
		}, 3000);
	}

	return (
		<section className="p-4 md:p-5 w-full flex flex-col gap-4">
			{isEdit && (
				<div className="bg-black/50 fixed z-40 inset-0 flex justify-center items-center px-4">
					<div className="bg-white p-5 rounded-md w-full max-w-sm">
						<h2 className="font-semibold text-xl mb-3">Adjust caption</h2>
						<ul className="flex flex-col gap-3">
							{captionProps.map((prop, idx) => (
								<li key={idx} className="flex justify-between items-center gap-2">
									<label htmlFor={prop} className="text-sm font-medium shrink-0">{prop}</label>
									<input type="text" name={prop} id={prop} className="outline-none border-b flex-1 min-w-0" onChange={(e) => setCapValues((prev) => ({ ...prev, [prop]: e.target.value }))} />
								</li>
							))}
						</ul>
						<button onClick={() => setIsEdit(false)} className="cursor-pointer py-2 px-4 rounded-md bg-gray-800 text-white font-semibold mt-5 w-full">
							Done
						</button>
					</div>
				</div>
			)}

			<article>
				<h1 className="text-2xl lg:text-4xl font-semibold mb-3">Ready to share!</h1>
				<div className="flex flex-col gap-3">
					<span className="text-sm font-medium">Caption:</span>
					<p className="p-2 border rounded-md border-gray-600/50 text-sm whitespace-pre-wrap">{filledCaption}</p>
					<div className="flex gap-2 text-xs md:text-sm">
						<button onClick={() => handleCopyCaption()} className="flex-1 bg-purple-700 text-white flex justify-center items-center p-3 gap-2 rounded-md cursor-pointer">
							{isCopied ? (
								<><ClipboardCheck size={16} /> Copied!</>
							) : (
								<><Clipboard size={16} /> Copy Caption</>
							)}
						</button>
						<button onClick={() => setIsEdit(true)} className="flex-1 bg-purple-700 text-white flex justify-center items-center p-3 gap-2 rounded-md cursor-pointer">
							<SquarePen size={16} />
							Edit Caption
						</button>
					</div>
				</div>
			</article>

			<button onClick={() => handleDownloadCanvas(canvas, "fancy-twibbon.png")} className="flex items-center justify-center gap-2 font-semibold cursor-pointer bg-purple-700 p-4 text-white rounded-xl w-full md:w-fit">
				<ArrowDownToLine size={18} />
				Download Image
			</button>
		</section>
	);
}
