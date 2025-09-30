import { HydrateClient } from "~/trpc/server";
import Link from "next/link";
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
        <div className={"my-24 flex flex-col gap-12"}>
          <div className={"container mx-auto grid grid-cols-12 gap-12"}>
            <section className={"col-span-8"}>
              <Card>
                <h3 className={"text-ink text-xl font-medium"}>About me</h3>
                <div className={"flex flex-col gap-2"}>
                  <h4 className={"text-ink-muted text-xs font-semibold"}>
                    Where I’m From
                  </h4>
                  <p className={"text-ink-muted text-sm font-normal"}>
                    I was born and raised in the Netherlands. My dad and mom both
                    worked hard to give me and my brother the space to figure
                    things out on our own. I spent way too many hours behind a
                    computer screen as a kid, tinkering with code and games which
                    in hindsight, turned out to be a pretty good investment of
                    time.
                  </p>
                </div>
                <div className={"flex flex-col gap-2"}>
                  <h4 className={"text-ink-muted text-xs font-semibold"}>
                    What I Used to Do
                  </h4>
                  <p className={"text-ink-muted text-sm font-normal"}>
                    My first jobs weren’t glamorous, I stocked shelves and tried
                    out a few things that taught me more about people. Eventually,
                    I leaned into tech — building small projects, doing side gigs,
                    and exploring how software could make life (and work) simpler.
                  </p>
                </div>
                <div className={"flex flex-col gap-2"}>
                  <h4 className={"text-ink-muted text-xs font-semibold"}>
                    What I Do Now
                  </h4>
                  <p className={"text-ink-muted text-sm font-normal"}>
                    Today, I’m a medior software engineer, currently working at{" "}
                    <Link href={"https://dictu.nl"} className={"font-medium text-brand hover:text-brand/90"}>
                      DICTU
                    </Link>
                    . On the side, I like to experiment with new libraries, tools,
                    and building out ideas. I like working where code meets
                    people, making tools that don’t just ‘run’ but make someone’s
                    day easier.
                  </p>
                </div>
                <div className={"flex flex-col gap-2"}>
                  <h4 className={"text-ink-muted text-xs font-semibold"}>
                    Where I’m At Now
                  </h4>
                  <p className={"text-ink-muted text-sm font-normal"}>
                    I live in Gouda, balancing work, hobbies, and side projects.
                    When I’m not coding, you’ll usually find me at the gym (or
                    trying to convince myself to go), or hanging out with friends
                    and family.
                  </p>
                </div>
                <div className={"flex flex-col gap-2"}>
                  <h4 className={"text-ink-muted text-xs font-semibold"}>
                    What I’m Looking For
                  </h4>
                  <p className={"text-ink-muted text-sm font-normal"}>
                    Opportunities to create impactful products with talented
                    teams. I believe in using tech to cut through complexity, not
                    add to it. Also: I’m convinced that software for trades and
                    small businesses is still stuck in the ‘90s — and I’d like to
                    help change that.
                  </p>
                </div>
              </Card>
            </section>
            <div className={"col-span-4 flex flex-col gap-12"}>
              <section>
                <SpotifyCard />
              </section>
              <section>
                <LinkedinCard />
              </section>
            </div>
            <section className={"col-span-12 flex flex-col gap-12"}>
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
