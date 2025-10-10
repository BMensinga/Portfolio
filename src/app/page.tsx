import { HydrateClient } from "~/trpc/server";
import { MenuBar } from "~/app/components/menu-bar";
import { SpotifyCard } from "~/app/components/cards/spotify-card";
import { Card } from "~/app/components/cards/card";
import { Experience, type TExperience } from "~/app/components/experience";
import { Education, type TEducation } from "~/app/components/education";
import { Footer } from "~/app/components/footer";
import { Intro } from "~/app/components/intro";
import { LinkedinCard } from "~/app/components/cards/linkedin-card";
import { createCaller } from "~/server/api/root";
import { env } from "~/env";
import type { WeatherPayload } from "~/server/api/routers/weather";
import { AboutMe } from "~/app/components/cards/about-me";

const experiences: TExperience[] = [
  {
    company: "DICTU",
    logo: "/logos/dictu.webp",
    alt: "The logo of Dienst ICT Uitvoering",
    experienceItems: [
      {
        title: "Software Engineer",
        titleDescription: 'via Finalist',
        jobType: "Contract",
        startDate: new Date(2024, 11),
        description:
          "Develop AI Chat and AI Assistant features.\n" +
          "Develop Whiteboards with real-time collaboration.\n" +
          "Build and maintain the Zalo Mini App for Simplamo with seamless integration.\n" +
          "Develop interactive chart and analytics widgets for the Dashboard to enhance data visualization.\n" +
          "Develop and maintain core features to enhance functionality and user experience.\n" +
          "Ensure UI/UX consistency and adherence to standards.\n" +
          "Implement robust frontend solutions for web and mobile platforms.\n" +
          "Analyze technical capabilities and provide optimal solutions.",
      },
    ],
  },
  {
    company: "Finalist",
    logo: "/logos/finalist.webp",
    alt: "The logo of Finalist",
    experienceItems: [
      {
        title: "Software Engineer",
        jobType: "Part-time",
        startDate: new Date(2023, 1),
        description: ''
      }
    ]
  },
  {
    company: ".VDMi/",
    logo: "/logos/vdmi.webp",
    alt: "The logo of VDMi",
    experienceItems: [
      {
        title: "Junior Drupal developer",
        jobType: "Part-time",
        startDate: new Date(2020, 4),
        endDate: new Date(2023, 0),
        description: ''
      },
      {
        title: "Junior Drupal developer",
        jobType: "Internship",
        startDate: new Date(2019, 9),
        endDate: new Date(2020, 6),
        description: ''
      }
    ]
  }
];

const education: TEducation[] = [
  {
    school: "De Haagse Hogeschool / The Hague University of Applied Sciences",
    logo: "/logos/hhs.webp",
    alt: "Logo of The Hague University of Applied Sciences",
    degree: "Bachelor's degree",
    degreeDescription: "Informatica (Software engineering) / Hogere opleiding Software engineer",
    startDate: new Date(2020, 8),
    endDate: new Date(2025, 6),
    description: "test",
  },
  {
    school: "Grafisch Lyceum Rotterdam",
    logo: "/logos/glr.webp",
    alt: "Logo of the Grafisch Lyceum Rotterdam",
    degree: "MBO niveau 4",
    degreeDescription: "Applicatie- en mediaontwikkelaar ",
    startDate: new Date(2017, 8),
    endDate: new Date(2020, 6),
    description: "test",
  }
]

export default async function Home() {
  const caller = createCaller({
    headers: new Headers([
      ['Authorization', `Bearer ${env.TRPC_AUTH_TOKEN}`],
    ]),
  });

  let weather: WeatherPayload | null = null;

  try {
    weather = await caller.weather.current({
      latitude: 52.0182,
      longitude: 4.687,
      units: 'metric',
    });
  } catch (error) {
    console.error('[weather] failed to load weather data', error);
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
                <SpotifyCard />
              </section>
              <section className={'w-full h-full'}>
                <LinkedinCard />
              </section>
            </div>
            <section className={"col-span-3 flex flex-col gap-12"}>
              <Card>
                <div className={'flex flex-col gap-6'}>
                  <h3 className={"text-ink text-xl font-medium"}>Experience</h3>
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
                  <h3 className={"text-ink text-xl font-medium"}>Education</h3>
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
