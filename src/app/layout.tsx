import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CryptoListProvider from "./Context/context";
import Navbar from "./Components/Navbar";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Crypto Knight",
  description: "Track your assets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <head>
          <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
        </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CryptoListProvider>
        <Navbar />
          {children}
        </CryptoListProvider>
      </body>
    </html>
  );
}
