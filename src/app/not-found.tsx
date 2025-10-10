import { redirect } from "~/i18n/navigation";
import { getLocale } from "next-intl/server";

export default async function NotFound() {
  const locale = await getLocale();

  redirect({ href: '/', locale: locale ?? 'en'});
}