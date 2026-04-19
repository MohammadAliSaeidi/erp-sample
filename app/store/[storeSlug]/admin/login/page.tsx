"use client";

import DarkVeil from "@/components/DarkVeil";
import { LoginForm } from "@/features/auth/ui/components/login-form";
import { useStoreUrlSlug } from "@/features/shared/hooks/use-store-url-slug";

export default function LoginPage() {
	const storeSlug = useStoreUrlSlug();

	return (
		<div className="flex min-h-svh w-svw items-center justify-center relative p-6 md:p-10 bg-black overflow-hidden">
			<div className="absolute inset-0">
				<DarkVeil
					hueShift={0}
					noiseIntensity={0.05}
					scanlineIntensity={0}
					speed={0.5}
					scanlineFrequency={0}
					warpAmount={0}
					maxFps={20}
				/>
			</div>
			<div className="w-full max-w-sm z-100">
				<LoginForm storeSlug={storeSlug as string} />
			</div>
		</div>
	);
}
