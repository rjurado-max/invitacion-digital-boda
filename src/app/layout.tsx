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
  metadataBase: new URL("https://invitacion-digital-boda-gamma.vercel.app"),
  title: "Frances & Roger — Nuestra Boda",
  description:
    "Acompáñanos en el inicio de nuestra nueva historia. Confirma tu asistencia y conoce todos los detalles de este día tan especial.",
  other: {
    google: "notranslate",
  },
  openGraph: {
    title: "Frances & Roger — Nuestra Boda",
    description:
      "Acompáñanos en el inicio de nuestra nueva historia. Confirma tu asistencia y conoce todos los detalles de este día tan especial.",
    url: "https://invitacion-digital-boda-gamma.vercel.app",
    siteName: "Frances & Roger",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Frances & Roger - Invitación de boda",
      },
    ],
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frances & Roger — Nuestra Boda",
    description:
      "Acompáñanos en el inicio de nuestra nueva historia. Confirma tu asistencia y conoce todos los detalles de este día tan especial.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      translate="no"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
