import { useEffect, useRef } from "react";

type TransformType = {
	x: number;
	y: number;
	scale: number;
	rotate: number;
};

type CanvasProps = {
	isEditMode: boolean;
	transform: TransformType;
	setTransform: React.Dispatch<React.SetStateAction<TransformType>>;
	userPhoto: HTMLImageElement | null;
	frameSrc: string;
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
};

export default function TwibbonCanvas({ userPhoto, transform, frameSrc, isEditMode, setTransform, canvasRef }: CanvasProps) {
	// Dimensi mengikuti ukuran asli twibbon (1475 x 1844) — tidak diperkecil
	const canvasWidth = 1475;
	const canvasHeight = 1844;
	const frameRef = useRef(new Image());

	function draw() {
		const canvas = canvasRef?.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Aktifkan image smoothing kualitas tinggi agar tidak pecah saat di-scale
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = "high";

		ctx.clearRect(0, 0, canvasWidth, canvasHeight);

		if (userPhoto) {
			ctx.save();
			ctx.translate(canvasWidth / 2 + transform.x, canvasHeight / 2 + transform.y);
			ctx.rotate((transform.rotate * Math.PI) / 180);
			ctx.scale(transform.scale / 100, transform.scale / 100);
			// Gambar foto pada ukuran aslinya agar tidak ada degradasi kualitas
			ctx.drawImage(userPhoto, -userPhoto.naturalWidth / 2, -userPhoto.naturalHeight / 2, userPhoto.naturalWidth, userPhoto.naturalHeight);
			ctx.restore();
		}

		// Frame ditarik tepat seukuran canvas (1475x1844) — full resolusi asli
		ctx.drawImage(frameRef.current, 0, 0, canvasWidth, canvasHeight);
	}

	useEffect(() => {
		frameRef.current.src = frameSrc;
		frameRef.current.onload = draw;
	}, [frameSrc]);

	useEffect(draw, [userPhoto, transform]);

	const isDragging = useRef(false);
	const lastPos = useRef({ x: 0, y: 0 });

	function handleDragDown(e: React.PointerEvent<HTMLCanvasElement>) {
		if (!isEditMode) return;
		isDragging.current = true;
		lastPos.current = { x: e.clientX, y: e.clientY };
		e.currentTarget.setPointerCapture(e.pointerId);
	}

	function handleDragMove(e: React.PointerEvent<HTMLCanvasElement>) {
		if (!isEditMode) return;
		if (!isDragging.current) return;

		const dx = e.clientX - lastPos.current.x;
		const dy = e.clientY - lastPos.current.y;
		lastPos.current = { x: e.clientX, y: e.clientY };

		const canvas = canvasRef.current!;
		// Hitung rasio piksel canvas vs ukuran tampil CSS
		const ratio = canvas.width / canvas.clientWidth;

		setTransform((prev) => ({
			...prev,
			x: prev.x + dx * ratio,
			y: prev.y + dy * ratio,
		}));
	}

	function handleDragUp() {
		if (!isEditMode) return;
		isDragging.current = false;
	}

	// w-full h-auto → canvas mengecil di layar tapi resolusi internal tetap 1475x1844
	return (
		<canvas
			ref={canvasRef}
			width={canvasWidth}
			height={canvasHeight}
			className={`w-full h-auto ${isEditMode && "cursor-move"}`}
			onPointerDown={handleDragDown}
			onPointerMove={handleDragMove}
			onPointerUp={handleDragUp}
		/>
	);
}
