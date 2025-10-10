import { Card } from "~/app/[locale]/components/cards/card";
import { TypescriptIcon } from "~/app/[locale]/components/icons/stack/typescript";
import { ReactIcon } from "~/app/[locale]/components/icons/stack/react";
import { NextjsIcon } from "~/app/[locale]/components/icons/stack/nextjs";
import { TrpcIcon } from "~/app/[locale]/components/icons/stack/trpc";
import { NodejsIcon } from "~/app/[locale]/components/icons/stack/nodejs";
import { TailwindIcon } from "~/app/[locale]/components/icons/stack/tailwind";
import { GitIcon } from "~/app/[locale]/components/icons/stack/git";
import { DockerIcon } from "~/app/[locale]/components/icons/stack/docker";
import { MysqlIcon } from "~/app/[locale]/components/icons/stack/mysql";
import { PostgresIcon } from "~/app/[locale]/components/icons/stack/postgres";
import { MotionIcon } from "~/app/[locale]/components/icons/stack/motion";
import { ZustandIcon } from "~/app/[locale]/components/icons/stack/zustand";
import { JavaIcon } from "~/app/[locale]/components/icons/stack/java";
import { useTranslations } from "next-intl";

export function Stack() {
  const t = useTranslations('stack');

  return (
    <Card>
      <div className={'flex flex-col gap-6'}>
        <h3 className={'text-ink text-xl font-medium'}>{t('title')}</h3>
        <p className={'text-ink-muted text-sm font-normal'}>
          {t('description')}
        </p>
        <div className={'flex flex-wrap gap-4 rounded-lg bg-white p-4 items-center'}>
          <TypescriptIcon />
          <ReactIcon />
          <NextjsIcon />
          <TrpcIcon />
          <NodejsIcon />
          <TailwindIcon />
          <GitIcon />
          <DockerIcon />
          <MysqlIcon />
          <PostgresIcon />
          <MotionIcon />
          <ZustandIcon />
          <JavaIcon />
        </div>
      </div>
    </Card>
  );
}
