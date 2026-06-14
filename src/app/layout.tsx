import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArachnidForms",
  description: "The Modular Form Builder Platform. Create dynamic, visual, and highly interactive forms in minutes.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://anachnidforms.vercel.app"),
  keywords: ["Form Builder", "Modular Forms", "Dynamic Forms", "Survey Tool", "Form Automation", "Open Source Forms"],
  authors: [{ name: "ArachnidForms Team", url: "https://anachnidforms.vercel.app" }],
  creator: "ArachnidForms",
  publisher: "ArachnidForms",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "ArachnidForms",
    description: "The Modular Form Builder Platform. Create dynamic, visual, and highly interactive forms in minutes.",
    url: "/",
    siteName: "ArachnidForms",
    images: [
      {
        url: "/header.png",
        width: 1200,
        height: 630,
        alt: "ArachnidForms Header Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArachnidForms",
    description: "The Modular Form Builder Platform. Create dynamic, visual, and highly interactive forms in minutes.",
    images: ["/header.png"],
    creator: "@arachnidforms",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
