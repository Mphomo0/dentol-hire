import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dantol Hire — Tool, Equipment & Machinery Rental | Johannesburg",
    template: "%s | Dantol Hire",
  },
  description:
    "Premium tool, equipment, machinery and trailer hire in Johannesburg. Fast quotes, well-maintained fleet, flexible rates.",
  metadataBase: new URL("https://dantol.co.za"),
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: "Dantol Hire",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-ZA"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
