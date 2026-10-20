import { Brand } from "@/components/shared";
export const metadata = { title: "Preview privacy & terms" };
export default function Page() {
  return (
    <main className="legal-page">
      <Brand />
      <h1>Privacy & terms for this preview.</h1>
      <p>
        This Fix-it build is a design and interaction preview. Its operations
        dashboard uses fictional sample records, and demo edits are stored in
        your own browser.
      </p>
      <h2>Your information</h2>
      <p>
        The unconfigured preview does not submit passwords or account details to
        an authentication provider. Once the owner connects Supabase, sign-in
        details are processed by that configured service, and social sign-in is
        handled by the provider you choose.
      </p>
      <p>
        Local repair requests and dashboard preferences remain in this browser.
        Clear this site’s browser data to remove them. The dashboard reset
        action restores its sample records.
      </p>
      <h2>Using the preview</h2>
      <p>
        Creating jobs, assigning artisans, approving applications and payouts,
        and resolving cases are local demonstrations. They do not book real
        services, verify identities, send messages, move money or issue
        guarantees.
      </p>
      <h2>Before a public service launch</h2>
      <p>
        The operator must supply complete business terms, contact information,
        service policies, privacy disclosures and any cancellation or refund
        policy before accepting live bookings or payments. These preview notes
        do not replace those documents.
      </p>
      <a className="button button-navy" href="/">
        Back to home
      </a>
    </main>
  );
}
