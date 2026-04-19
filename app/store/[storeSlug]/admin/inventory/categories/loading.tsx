import { SpinnerCustom } from "@/components/ui/spinner";

function Loading() {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<SpinnerCustom />
		</div>
	);
}

export default Loading;
