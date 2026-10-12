import { Trans } from "@lingui/react/macro";
import { supportEmail } from "@reactive-resume/utils/brand";
import { Footer } from "@/routes/_home/-sections/footer";

export function PrivacyPage() {
	return (
		<>
			<main id="main-content" className="mx-auto max-w-3xl space-y-8 px-5 pt-32 pb-16 leading-relaxed">
				<header className="space-y-3">
					<h1 className="font-semibold text-3xl">
						<Trans>Privacy Policy</Trans>
					</h1>
					<p className="text-muted-foreground text-sm">
						<Trans>Updated: October 12, 2026</Trans>
					</p>
					<p>
						<Trans>This notice applies to this resume website and its account, resume, and email features.</Trans>
					</p>
				</header>
				<section className="space-y-3">
					<h2 className="font-semibold text-xl">
						<Trans>Who operates this service</Trans>
					</h2>
					<p>
						<Trans>
							This service is operated as part of afeiii.com and is based on the open-source Reactive Resume project. It
							is hosted in Oracle Cloud's US West (Phoenix) region.
						</Trans>
					</p>
				</section>
				<section className="space-y-3">
					<h2 className="font-semibold text-xl">
						<Trans>Account and resume data</Trans>
					</h2>
					<p>
						<Trans>
							Your account name, username, email address, password hash, resume content, uploaded images, and saved
							application or cover-letter content are stored on our server and database to provide the features you use.
							Passwords are stored as hashes, not as readable text.
						</Trans>
					</p>
					<p>
						<Trans>
							Only include information that you want to use in your resume. Avoid uploading identity documents,
							passwords, or other unnecessary sensitive information.
						</Trans>
					</p>
				</section>
				<section className="space-y-3">
					<h2 className="font-semibold text-xl">
						<Trans>Public sharing and exports</Trans>
					</h2>
					<p>
						<Trans>
							A resume marked public can be viewed by people with its link. Check the visibility setting and any
							password protection before sharing. Copies already downloaded or forwarded by other people cannot be
							recalled by changing visibility or deleting your account.
						</Trans>
					</p>
				</section>
				<section className="space-y-3">
					<h2 className="font-semibold text-xl">
						<Trans>Verification and password-reset emails</Trans>
					</h2>
					<p>
						<Trans>
							We use Resend to send account verification, password-reset, and email-change messages. Resend processes
							the recipient address and the email content, including action links, to deliver these messages. We do not
							send your resume content in these account emails.
						</Trans>
					</p>
					<a
						className="text-primary underline underline-offset-4"
						href="https://resend.com/legal/privacy-policy"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Trans>Resend privacy policy</Trans>
					</a>
				</section>
				<section className="space-y-3">
					<h2 className="font-semibold text-xl">
						<Trans>Cookies, preferences, and service logs</Trans>
					</h2>
					<p>
						<Trans>
							Cookies and browser storage keep you signed in and remember preferences such as language and theme. The
							server and infrastructure providers may process IP addresses, browser information, request times, and
							errors to operate and protect the service.
						</Trans>
					</p>
				</section>
				<section className="space-y-3">
					<h2 className="font-semibold text-xl">
						<Trans>Optional AI and external services</Trans>
					</h2>
					<p>
						<Trans>
							If you configure an AI provider and use an AI feature, the content needed for that request is sent to the
							selected provider. Review that provider's data policy before using it. External documentation, donation,
							and community links lead to services with their own policies.
						</Trans>
					</p>
				</section>
				<section className="space-y-3">
					<h2 className="font-semibold text-xl">
						<Trans>Manage your data and contact us</Trans>
					</h2>
					<p>
						<Trans>
							You can edit and export your resumes and delete your account in account settings. If you need help
							accessing or deleting data, contact us. Operational backups, when present, may retain earlier copies until
							they are replaced.
						</Trans>
					</p>
					<a className="text-primary underline underline-offset-4" href={`mailto:${supportEmail}`}>
						{supportEmail}
					</a>
				</section>
			</main>
			<Footer />
		</>
	);
}
