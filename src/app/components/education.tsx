import Image from "next/image";
import { formatDate } from "~/app/libs/utils";

export type TEducation = {
  school: string
  logo: string
  alt: string
  degree: string
  degreeDescription: string
  startDate: Date,
  endDate: Date,
  description?: string,
}

type EducationProps = {
  education: TEducation
}

export function Education({ education }: EducationProps) {
  const start = formatDate(education.startDate)
  const end = formatDate(education.endDate)

  return (
    <div className={'flex flex-col gap-2 rounded-lg bg-white p-4'}>
      <div className={'flex items-center justify-between gap-4'}>
        <div className={'flex items-center gap-2'}>
          <Image
            className={'border-border h-8 w-8 rounded-lg border'}
            src={education.logo}
            alt={education.alt}
            width={32}
            height={32}
          />
          <h4 className={'text-ink text-sm font-semibold'}>
            {education.school}
          </h4>
        </div>
      </div>
      <div className={'flex flex-col'}>
        <div className={'flex gap-2'}>
          <div className={'flex flex-col items-center gap-2'}>
            <span className={'bg-divider mt-2 h-2 w-2 flex-shrink-0 rounded-full'} />
          </div>
          <div className={'flex min-w-0 flex-1 flex-col gap-2'}>
            <div className={'flex flex-col gap-1'}>
              <div className={'flex items-center gap-2'}>
                <h5 className={'text-ink text-sm font-medium'}>
                  {education.degree}, {education.degreeDescription}
                </h5>
              </div>
              <span className={'text-ink-muted text-xs font-normal'}>
                {start} - {end}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}