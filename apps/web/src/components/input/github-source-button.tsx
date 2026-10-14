import { t } from "@lingui/core/macro";
import { GithubLogoIcon } from "@phosphor-icons/react";
import { Button } from "@reactive-resume/ui/components/button";
import { sourceCodeUrl } from "@reactive-resume/utils/brand";

export function GithubSourceButton() {
	return (
		<Button
			variant="secondary"
			nativeButton={false}
			render={
				<a target="_blank" href={sourceCodeUrl} aria-label={t`Source code`} rel="noopener noreferrer">
					<GithubLogoIcon aria-hidden="true" />
					<span>{t`Source code`}</span>
				</a>
			}
		/>
	);
}
