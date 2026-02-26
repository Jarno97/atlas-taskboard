import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Taskboard | Atlas & Jarno",
    template: "%s | Taskboard",
  },
  description: "Collaborative task board for Atlas and Jarno. Track projects, automations, and research.",
  metadataBase: new URL("https://atlas-taskboard.vercel.app"),
  openGraph: {
    title: "Taskboard | Atlas & Jarno",
    description: "Collaborative task board for Atlas and Jarno",
    url: "https://atlas-taskboard.vercel.app",
    siteName: "Taskboard",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Taskboard | Atlas & Jarno",
    description: "Collaborative task board",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
