import "~/styles/globals.css";

import { type Metadata } from "next";
import { Poppins } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { MenuBarVisibilityProvider } from "~/app/providers/menu-bar-visibility-provider";

export const metadata: Metadata = {
  title: "Bas Mensinga | Portfolio",
  description: "Portfolio of Bas Mensinga",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body>
        <MenuBarVisibilityProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </MenuBarVisibilityProvider>
      </body>
    </html>
  );
}
