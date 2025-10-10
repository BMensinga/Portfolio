import { Card } from "~/app/[locale]/components/cards/card";
import { Link } from "~/i18n/navigation";
import { useTranslations } from "next-intl";

export function AboutMe() {
  const t = useTranslations('about');

  return (
    <Card>
      <h3 className={'text-ink text-xl font-medium'}>{t('title')}</h3>
      <section className={'flex flex-col gap-2'}>
        <h4 className={'text-ink-muted text-xs font-semibold'}>
          {t('sections.origin.title')}
        </h4>
        <p className={'text-ink-muted text-sm font-normal'}>
          {t('sections.origin.body')}
        </p>
      </section>
      <section className={'flex flex-col gap-2'}>
        <h4 className={'text-ink-muted text-xs font-semibold'}>
          {t('sections.past.title')}
        </h4>
        <p className={'text-ink-muted text-sm font-normal'}>
          {t('sections.past.body')}
        </p>
      </section>
      <section className={'flex flex-col gap-2'}>
        <h4 className={'text-ink-muted text-xs font-semibold'}>
          {t('sections.present.title')}
        </h4>
        <p className={'text-ink-muted text-sm font-normal'}>
          {t.rich('sections.present.body', {
            dictu: (chunks) => (
              <Link
                href={'https://dictu.nl'}
                className={'font-medium text-brand hover:text-brand/90'}
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </section>
      <section className={'flex flex-col gap-2'}>
        <h4 className={'text-ink-muted text-xs font-semibold'}>
          {t('sections.life.title')}
        </h4>
        <p className={'text-ink-muted text-sm font-normal'}>
          {t('sections.life.body')}
        </p>
      </section>
      <section className={'flex flex-col gap-2'}>
        <h4 className={'text-ink-muted text-xs font-semibold'}>
          {t('sections.future.title')}
        </h4>
        <p className={'text-ink-muted text-sm font-normal'}>
          {t('sections.future.body')}
        </p>
      </section>
    </Card>
  );
}
