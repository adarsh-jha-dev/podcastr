import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "@/_providers/ConvexClerkProvider";
import AudioProvider from "@/_providers/AudioProvider";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Podcastr",
  description: "Generated your podcasts using AI",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AudioProvider>
        <body className={`${manrope.className}`}>
          <ConvexClerkProvider>{children}</ConvexClerkProvider>
        </body>
      </AudioProvider>
    </html>
  );
}
