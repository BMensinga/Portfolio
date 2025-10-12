'use client'

import Image from 'next/image';
import { ChevronsDownUpIcon, ChevronsUpDownIcon } from 'lucide-react';
import { cn } from '~/app/libs/utils';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Button } from '~/app/components/button';
import { useFormatter, useTranslations } from 'next-intl';

export type TExperienceItem = {
  title: string;
  titleDescription?: string;
  jobType: 'Full-time' | 'Part-time' | 'Internship' | 'Freelance' | 'Contract';
  startDate: Date;
  endDate?: Date;
  description?: string;
};

export type TExperience = {
  company: string;
  logo: string;
  alt: string;
  experienceItems: TExperienceItem[];
};

type ExperienceProps = {
  experience: TExperience;
};

export function Experience({ experience }: ExperienceProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [descriptionHeights, setDescriptionHeights] = useState<number[]>([]);
  const descriptionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const detailsId = useId();
  const hasDescriptions = useMemo(
    () => experience.experienceItems.some((item) => Boolean(item.description)),
    [experience.experienceItems],
  );
  const t = useTranslations('experience');
  const formatter = useFormatter();

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    const measuredHeights = descriptionRefs.current.map((node) =>
      node?.scrollHeight ?? 0,
    );

    setDescriptionHeights((previous) => {
      const isSameLength = previous.length === measuredHeights.length;
      const isSameValues = isSameLength
        ? previous.every((value, index) => value === measuredHeights[index])
        : false;

      return isSameValues ? previous : measuredHeights;
    });
  }, [isExpanded, experience.experienceItems]);

  return (
    <div className={'flex flex-col gap-2 rounded-lg bg-white p-4'}>
      <div className={'flex items-center justify-between gap-4'}>
        <div className={'flex items-center gap-2'}>
          <Image
            className={'border-border h-8 w-8 rounded-lg border'}
            src={experience.logo}
            alt={experience.alt}
            width={32}
            height={32}
          />
          <h4 className={'text-ink text-sm font-semibold'}>
            {experience.company}
          </h4>
        </div>
        {hasDescriptions && (
          <Button
            variant={'ghost'}
            size={'icon'}
            aria-expanded={isExpanded}
            aria-controls={detailsId}
            aria-label={isExpanded ? t('toggle.showLess') : t('toggle.showMore')}
            className={'px-2'}
            onClick={() => setIsExpanded((expanded) => !expanded)}
          >
            {isExpanded ? (
              <ChevronsDownUpIcon className={'text-ink-muted size-4 stroke-3'} />
            ) : (
              <ChevronsUpDownIcon className={'text-ink-muted size-4 stroke-3'} />
            )}
          </Button>
        )}
      </div>
      <div className={'flex flex-col'} id={detailsId}>
        {experience.experienceItems.map((item, index) => {
          const isLast = index === experience.experienceItems.length - 1;
          const start = formatter.dateTime(item.startDate, {
            month: 'short',
            year: 'numeric',
          });
          const end = item.endDate
            ? formatter.dateTime(item.endDate, {
                month: 'short',
                year: 'numeric',
              })
            : t('current');
          const duration = formatDurationLabel(t, item.startDate, item.endDate);
          const jobTypeLabel = getJobTypeLabel(t, item.jobType);

          return (
            <div
              className={'flex gap-2'}
              key={`e-${experience.company}-${index}`}
            >
              <div className={'flex flex-col items-center gap-2'}>
                <span
                  className={'bg-divider mt-2 h-2 w-2 flex-shrink-0 rounded-full'}
                />
                {!isLast && (
                  <span className={'bg-divider h-full w-px rounded-full'} />
                )}
              </div>
              <div
                className={cn(
                  'flex min-w-0 flex-1 flex-col gap-2',
                  !isLast ? 'pb-4' : '',
                )}
              >
                <div className={'flex flex-col gap-1'}>
                  <div className={'flex items-center gap-2'}>
                    <h5 className={'text-ink text-sm font-medium'}>
                      {item.title}
                    </h5>
                    {item.titleDescription && (
                      <span className={'text-ink-muted text-xs font-medium'}>
                        {item.titleDescription}
                      </span>
                    )}
                  </div>
                  <span className={'text-ink-muted text-xs font-normal'}>
                    {jobTypeLabel} • {start} - {end} • {duration}
                  </span>
                </div>
                {item.description && (
                  <div
                    ref={(node) => {
                      descriptionRefs.current[index] = node;
                    }}
                    className={cn(
                      'overflow-hidden transition-[max-height,opacity] duration-150 ease-in-out',
                      isExpanded ? 'opacity-100' : 'opacity-0',
                    )}
                    style={{
                      maxHeight:
                        isExpanded && item.description
                          ? `${descriptionHeights[index] ?? 0}px`
                          : 0,
                    }}
                    aria-hidden={!isExpanded}
                  >
                    <p className={'text-ink-muted text-xs font-normal'}>
                      {item.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type Translator = (key: string, values?: Record<string, any>) => string;

const JOB_TYPE_KEYS: Record<TExperienceItem['jobType'], string> = {
  'Full-time': 'jobTypes.fullTime',
  'Part-time': 'jobTypes.partTime',
  Internship: 'jobTypes.internship',
  Freelance: 'jobTypes.freelance',
  Contract: 'jobTypes.contract',
};

function getJobTypeLabel(t: Translator, jobType: TExperienceItem['jobType']) {
  return t(JOB_TYPE_KEYS[jobType]);
}

function formatDurationLabel(t: Translator, start: Date, end?: Date) {
  const endDate = end ?? new Date();

  if (endDate < start) {
    return t('duration.lessThanMonth');
  }

  let totalMonths =
    (endDate.getFullYear() - start.getFullYear()) * 12 +
    (endDate.getMonth() - start.getMonth());

  if (endDate.getDate() < start.getDate()) {
    totalMonths -= 1;
  }

  totalMonths = Math.max(totalMonths, 0);

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts: string[] = [];

  if (years > 0) {
    parts.push(t('duration.years', { count: years }));
  }

  if (months > 0) {
    parts.push(t('duration.months', { count: months }));
  }

  if (parts.length === 0) {
    return t('duration.lessThanMonth');
  }

  return parts.join(' ');
}
