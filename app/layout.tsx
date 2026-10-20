import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: { default: "Fix-it — Home, handled.", template: "%s | Fix-it" },
  description:
    "Find a skilled artisan for everyday repairs. Explore home services, request a repair and keep every job in one place.",
  icons: { icon: "/logo.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/fonts/fonts.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
