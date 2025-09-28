import { HydrateClient } from "~/trpc/server";
import Link from "next/link";
import { Fog } from "~/app/components/fog";
import { FogProvider } from "~/app/providers/fog-provider";
import { MenuBar } from "~/app/components/menu-bar";
import { Clock, Code } from "lucide-react";
import { SpotifyPlayer } from "~/app/components/spotify-player";
import { Card } from "~/app/components/card";
import { LinkedinIcon } from "~/app/components/icons/linkedin";
import { ExternalLinkIcon } from "~/app/components/icons/external-link";
import { Experience, type TExperience } from "~/app/components/experience";
import { Education, type TEducation } from "~/app/components/education";
import { Footer } from "~/app/components/footer";

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
  return (
    <HydrateClient>
      <MenuBar />
      <main>
        <section>
          <FogProvider>
            <div className={"bg-brand-soft relative flex h-[576px] items-center"}>
              <div className={"z-20 container mx-auto flex flex-col gap-6"}>
                <h1
                  className={
                    "text-ink flex items-center gap-3 text-4xl font-medium"
                  }
                >
                  Hey, I am Bas.
                  <span
                    className={
                      "outline-brand/10 flex h-16 w-16 -rotate-[6deg] items-center justify-center rounded-lg bg-white outline-2 transition-transform duration-150 hover:rotate-0"
                    }
                  >
                  <span className={"h-15 w-15 rounded-md bg-red-800"}></span>
                </span>
                  I am a Software engineer.
                </h1>
                <h2
                  className={
                    "text-ink-muted flex items-center gap-3 text-2xl font-medium"
                  }
                >
                  I build software
                  <span
                    className={
                      "outline-brand/10 flex h-12 w-12 rotate-12 items-center justify-center rounded-lg bg-white outline-2 transition-transform duration-150 hover:rotate-0"
                    }
                  >
                  <Code className={"text-brand h-8 w-8 stroke-[2.5]"} />
                </span>
                  that makes complex things feel simple.
                </h2>
                <Link
                  href={"mailto:hey@basmensinga.nl"}
                  className={"bg-brand w-fit rounded-full px-4 py-1 text-white!"}
                >
                  Let's chat
                </Link>
              </div>
              <Fog />
              <div
                className={
                  "absolute bottom-0 left-0 h-16 w-full bg-linear-to-b from-transparent to-white"
                }
              />
            </div>
          </FogProvider>
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
                    <Link href={"https://dictu.nl"} className={"font-medium"}>
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
                <SpotifyPlayer />
              </section>
              <section>
                <Card>
                  <div className={"relative flex flex-col gap-4"}>
                    <div className={"flex flex-col gap-2"}>
                      <div className={"flex justify-between gap-4"}>
                        <div className={"flex gap-2"}>
                          <div
                            className={
                              "flex h-12 w-12 items-center justify-center rounded-full bg-white"
                            }
                          >
                          <span className={"text-ink-muted text-xs"}>
                            Image
                          </span>
                          </div>
                          <div className={"flex flex-col"}>
                            <p className={"text-ink text-sm font-medium"}>
                              Bas Mensinga
                            </p>
                            <span
                              className={"text-ink-muted text-xs font-normal"}
                            >
                            @bas-mensinga
                          </span>
                          </div>
                        </div>
                        <div
                          className={
                            "flex h-14 w-14 items-center justify-center rounded-[14px] bg-[#0A66C2]"
                          }
                        >
                          <LinkedinIcon />
                        </div>
                      </div>
                      <p className={"text-sm font-normal"}>
                        Currently at <Link href={"https://dictu.nl"}>@DICTU</Link>
                      </p>
                    </div>
                    <div className={"relative h-6"}>
                      <Link
                        href={"https://www.linkedin.com/in/bas-mensinga"}
                        className={
                          "border-border absolute -left-3 flex h-8 w-8 items-center justify-center rounded-full border bg-white"
                        }
                      >
                        <ExternalLinkIcon />
                      </Link>
                    </div>
                  </div>
                </Card>
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
