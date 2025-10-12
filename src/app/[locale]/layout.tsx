import "~/styles/globals.css";

import { type Metadata } from "next";
import { Poppins } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { MenuBarVisibilityProvider } from "~/app/providers/menu-bar-visibility-provider";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { routing } from "~/i18n/routing";
import { notFound } from "next/navigation";
import { getLocale, getMessages } from "next-intl/server";

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

type Props = {
  children: ReactNode;
  params: Promise<{locale: string}>;
};

export default async function RootLayout({ children, params }: Props) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const currentLocale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={`${currentLocale}`} className={`${poppins.variable}`}>
      <body>
        <NextIntlClientProvider locale={currentLocale} messages={messages}>
          <MenuBarVisibilityProvider>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </MenuBarVisibilityProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
