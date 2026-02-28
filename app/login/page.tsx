"use client";

import DarkVeil from "@/components/DarkVeil";
import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
	return (
		<div className="flex min-h-svh w-full items-center justify-center relative p-6 md:p-10">
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
				<LoginForm />
			</div>
		</div>
	);
}
