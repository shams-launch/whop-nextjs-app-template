import { WhopApp } from "@whop/react/components";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "frosted-ui/styles.css";
import { Theme } from "frosted-ui";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MasteryFlow - Learn & Grow",
  description: "MasteryFlow - Your personalized learning platform powered by Whop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WhopApp>
          <Theme accentColor="blue" grayColor="slate">
            {children}
          </Theme>
        </WhopApp>
      </body>
    </html>
  );
}


