import { HydrateClient } from "~/trpc/server";
import { MenuBar } from "~/app/[locale]/components/menu-bar";
import { SpotifyCard } from "~/app/[locale]/components/cards/spotify-card";
import { Card } from "~/app/[locale]/components/cards/card";
import { Experience, type TExperience } from "~/app/[locale]/components/cards/experience";
import { Education, type TEducation } from "~/app/[locale]/components/cards/education";
import { Footer } from "~/app/[locale]/components/footer";
import { Intro } from "~/app/[locale]/components/intro";
import { LinkedinCard } from "~/app/[locale]/components/cards/linkedin-card";
import { createCaller } from "~/server/api/root";
import { env } from "~/env";
import type { WeatherPayload } from "~/server/api/routers/weather";
import type { DeezerPlaylistPayload } from "~/server/api/routers/deezer";
import { AboutMe } from "~/app/[locale]/components/cards/about-me";
import { Stack } from "~/app/[locale]/components/cards/stack";
import { getTranslations } from "next-intl/server";

type ExperienceTemplate = {
  key: string;
  company: string;
  logo: string;
  experienceItems: Array<{
    key: string;
    jobType: TExperience["experienceItems"][number]["jobType"];
    startDate: Date;
    endDate?: Date;
  }>;
};

const EXPERIENCE_TEMPLATES: ExperienceTemplate[] = [
  {
    key: 'dictu',
    company: 'DICTU',
    logo: '/logos/dictu.webp',
    experienceItems: [
      {
        key: 'softwareEngineer',
        jobType: 'Contract',
        startDate: new Date(2024, 11),
      },
    ],
  },
  {
    key: 'finalist',
    company: 'Finalist',
    logo: '/logos/finalist.webp',
    experienceItems: [
      {
        key: 'softwareEngineer',
        jobType: 'Part-time',
        startDate: new Date(2023, 1),
      },
    ],
  },
  {
    key: 'vdmi',
    company: '.VDMi/',
    logo: '/logos/vdmi.webp',
    experienceItems: [
      {
        key: 'juniorDrupalDeveloperPartTime',
        jobType: 'Part-time',
        startDate: new Date(2020, 4),
        endDate: new Date(2023, 0),
      },
      {
        key: 'juniorDrupalDeveloperInternship',
        jobType: 'Internship',
        startDate: new Date(2019, 9),
        endDate: new Date(2020, 6),
      },
    ],
  },
];

type EducationTemplate = {
  key: string;
  school: string;
  logo: string;
  startDate: Date;
  endDate: Date;
};

const EDUCATION_TEMPLATES: EducationTemplate[] = [
  {
    key: 'hhs',
    school: 'De Haagse Hogeschool / The Hague University of Applied Sciences',
    logo: '/logos/hhs.webp',
    startDate: new Date(2020, 8),
    endDate: new Date(2025, 6),
  },
  {
    key: 'glr',
    school: 'Grafisch Lyceum Rotterdam',
    logo: '/logos/glr.webp',
    startDate: new Date(2017, 8),
    endDate: new Date(2020, 6),
  },
];

export default async function Home() {
  const [tExperience, tEducation] = await Promise.all([
    getTranslations('experience'),
    getTranslations('education'),
  ]);

  const experiences: TExperience[] = EXPERIENCE_TEMPLATES.map((template) => ({
    company: template.company,
    logo: template.logo,
    alt: tExperience(`companies.${template.key}.alt`),
    experienceItems: template.experienceItems.map((item) => {
      const titleDescription = tExperience(
        `companies.${template.key}.items.${item.key}.titleDescription`
      );
      const description = tExperience(
        `companies.${template.key}.items.${item.key}.description`
      );

      return {
        title: tExperience(`companies.${template.key}.items.${item.key}.title`),
        titleDescription: titleDescription || undefined,
        jobType: item.jobType,
        startDate: item.startDate,
        endDate: item.endDate,
        description: description || undefined,
      } satisfies TExperience["experienceItems"][number];
    }),
  }));

  const education: TEducation[] = EDUCATION_TEMPLATES.map((template) => ({
    school: template.school,
    logo: template.logo,
    alt: tEducation(`schools.${template.key}.alt`),
    degree: tEducation(`schools.${template.key}.degree`),
    degreeDescription: tEducation(`schools.${template.key}.degreeDescription`),
    startDate: template.startDate,
    endDate: template.endDate,
    description: tEducation(`schools.${template.key}.description`) || undefined,
  }));

  const caller = createCaller({
    headers: new Headers([
      ['Authorization', `Bearer ${env.TRPC_AUTH_TOKEN}`],
    ]),
  });

  let weather: WeatherPayload | null = null;
  let playlist: DeezerPlaylistPayload | null = null;

  try {
    weather = await caller.weather.current({
      latitude: 52.0182,
      longitude: 4.687,
      units: 'metric',
    });
  } catch (error) {
    console.error('[weather] failed to load weather data', error);
  }

  try {
    playlist = await caller.deezer.playlist();
  } catch (error) {
    console.error('[deezer] failed to load playlist data', error);
  }

  return (
    <HydrateClient>
      <MenuBar weather={weather} />
      <main>
        <section>
          <Intro />
        </section>
        <div className={"my-24 mx-2 sm:mx-0 flex flex-col gap-12"}>
          <div className={"container mx-auto grid grid-cols-3 gap-12"}>
            <section className={"col-span-3 lg:col-span-2"}>
              <AboutMe />
            </section>
            <div className={"col-span-3 lg:col-span-1 flex flex-col sm:flex-row lg:flex-col gap-6 sm:gap-12"}>
              <section className={'w-full h-full'}>
                <SpotifyCard playlist={playlist} />
              </section>
              <section className={'w-full h-full'}>
                <LinkedinCard />
              </section>
            </div>
            <section className={"col-span-3"}>
              <Stack />
            </section>
            <section className={"col-span-3 flex flex-col gap-12"}>
              <Card>
                <div className={'flex flex-col gap-6'}>
                  <h3 className={"text-ink text-xl font-medium"}>{tExperience('title')}</h3>
                  <div className={"flex flex-col gap-6"}>
                    { experiences.map((item, index) => (
                      <Experience
                        experience={item}
                        key={`exp-list-${item.company}-${index}`}
                      />
                    ))}
                  </div>
                </div>
                <div className={'flex flex-col gap-6'}>
                  <h3 className={"text-ink text-xl font-medium"}>{tEducation('title')}</h3>
                  <div className={"flex flex-col gap-6"}>
                    { education.map((item, index) => (
                      <Education
                        education={item}
                        key={`edu-list-${item.school}-${index}`}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </HydrateClient>
  );
}
