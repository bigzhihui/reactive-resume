import { Outlet } from "@tanstack/react-router";
import { BrandIcon } from "@reactive-resume/ui/components/brand-icon";
import { appName } from "@reactive-resume/utils/brand";

export function AuthLayout() {
	return (
		<div className="xs:px-0 mx-auto flex h-svh w-dvw max-w-sm flex-col justify-center gap-y-6 px-4">
			<BrandIcon className="mb-4 size-20 self-center [view-transition-name:auth-brand]" />

			<p className="text-center text-xl font-semibold">{appName}</p>
			<Outlet />
		</div>
	);
}
