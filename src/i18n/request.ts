import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import enMessages from '../../messages/en.json';
import nlMessages from '../../messages/nl.json';
import {routing} from './routing';

type AppLocale = (typeof routing)['locales'][number];
type Messages = typeof enMessages;

const messagesByLocale = {
  en: enMessages,
  nl: nlMessages
} satisfies Record<AppLocale, Messages>;

export default getRequestConfig(async ({requestLocale}) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: messagesByLocale[locale]
  };
});
