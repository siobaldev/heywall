import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const platypi = localFont({
  src: [
    {
      path: "../public/font/platypi-vf.woff2",
      weight: "400 500 700",
      style: "normal",
    },
  ],
  variable: "--font-platypi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Heywall",
  description:
    "A simple public wall where everyone can share thoughts, leave messages, and connect with the world in real time.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${platypi.variable} h-full antialiased`}>
      <head>
        <meta name="apple-mobile-web-app-title" content="Heywall" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
