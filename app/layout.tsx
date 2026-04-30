import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";

const schibsted_grotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martian_mono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevEvent",
  description: "AI-Powered Event Discovery Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${schibsted_grotesk.variable} ${martian_mono.variable} min-h-screen w-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        
        <div className="absolute inset-0 top-0 -z-[-1] min-h-screen" suppressHydrationWarning>
          <LightRays
          raysOrigin="top-center-offset"
          raysColor="#5dfeca"
          raysSpeed={0.5}
          lightSpread={0.9}
          rayLength={1.4}
          followMouse={true}
          mouseInfluence={0.02}
          noiseAmount={0}
          distortion={0.01}
          pulsating={false}
          /> 
        </div>

        <main>
          {children}  
        </main>
      </body>
    </html>
  );
}
