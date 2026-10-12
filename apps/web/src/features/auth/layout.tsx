import { Trans } from "@lingui/react/macro";
import { Link, Outlet } from "@tanstack/react-router";
import { BrandIcon } from "@reactive-resume/ui/components/brand-icon";
import { appName } from "@reactive-resume/utils/brand";

export function AuthLayout() {
	return (
		<div className="fade-in-0 slide-in-from-top-4 mx-auto flex h-svh w-dvw max-w-sm animate-in flex-col justify-center gap-y-6 px-4 xs:px-0 duration-300 ease-(--ease-out-strong)">
			<div className="mb-4 flex flex-col items-center gap-3">
				<BrandIcon className="size-20" />
				<p className="font-semibold text-xl">{appName}</p>
			</div>

			<Outlet />
			<Link to="/privacy" className="self-center text-muted-foreground text-sm underline underline-offset-4">
				<Trans>Privacy Policy</Trans>
			</Link>
		</div>
	);
}
