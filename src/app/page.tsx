import { HydrateClient } from "~/trpc/server";
import Link from "next/link";
import { Fog } from "~/app/_components/fog";
import { FogProvider } from "~/app/providers/fog-provider";
import { MenuBar } from "~/app/_components/menu-bar";

export default async function Home() {
  return (
    <HydrateClient>
      <MenuBar />
      <main>
        <FogProvider>
          <div className={'h-[576px] bg-[#B3D7FE] flex items-center relative'}>
            <div className={'container mx-auto flex flex-col gap-6 z-20'}>
              <h1 className={'text-4xl text-[#2D2D2D] font-medium'}>Hey, I am Bas. <span>(image)</span>I am a Software engineer.</h1>
              <h2 className={'text-2xl text-[#7D7D7D] font-medium'}>I build software <span>(image)</span> that makes complex things feel simple.</h2>
              <Link
                href={'mailto:hey@basmensinga.nl'}
                className={'bg-[#057AFF] px-4 py-1 text-white! rounded-full w-fit'}
              >Let's chat</Link>
            </div>
            <Fog />
            <div className={'h-16 bg-linear-to-b from-transparent to-white w-full absolute bottom-0 left-0'}/>
          </div>
        </FogProvider>
        <div className={'flex flex-col gap-12 my-24'}>
          <div className={'container mx-auto grid grid-cols-12 gap-12'}>
            <div className={'bg-[#F5F5F7] rounded-2xl col-span-8 flex flex-col gap-6 p-6'}>
              <h3 className={'text-xl font-medium text-[#2D2D2D]'}>About me</h3>
              <div>
                <h4 className={'text-xs font-semibold text-[#7D7D7D]'}>Where I’m From</h4>
                <p className={'text-sm font-normal text-[#7D7D7D]'}>
                  I was born and raised in the Netherlands. My dad and mom both worked hard to give me and my brother the
                  space to figure things out on our own. I spent way too many hours behind a computer screen as a kid,
                  tinkering with code and games which in hindsight, turned out to be a pretty good investment of time.
                </p>
              </div>
              <div>
                <h4 className={'text-xs font-semibold text-[#7D7D7D]'}>What I Used to Do</h4>
                <p className={'text-sm font-normal text-[#7D7D7D]'}>
                  My first jobs weren’t glamorous, I stocked shelves and tried out a few things that taught me more about
                  people. Eventually, I leaned into tech — building small projects, doing side gigs, and exploring how
                  software could make life (and work) simpler.
                </p>
              </div>
              <div>
                <h4 className={'text-xs font-semibold text-[#7D7D7D]'}>What I Do Now</h4>
                <p className={'text-sm font-normal text-[#7D7D7D]'}>
                  Today, I’m a medior software engineer, currently working at <Link href={'https://dictu.nl'} className={'font-medium'}>DICTU</Link>. On the side, I like to experiment
                  with new libraries, tools, and building out ideas. I like working where code meets people, making tools
                  that don’t just ‘run’ but make someone’s day easier.
                </p>
              </div>
              <div>
                <h4 className={'text-xs font-semibold text-[#7D7D7D]'}>Where I’m At Now</h4>
                <p className={'text-sm font-normal text-[#7D7D7D]'}>
                  I live in Gouda, balancing work, hobbies, and side projects. When I’m not coding, you’ll usually find me
                  at the gym (or trying to convince myself to go), or hanging out with friends and family.
                </p>
              </div>
              <div>
                <h4 className={'text-xs font-semibold text-[#7D7D7D]'}>What I’m Looking For</h4>
                <p className={'text-sm font-normal text-[#7D7D7D]'}>
                  Opportunities to create impactful products with talented teams. I believe in using tech to cut through
                  complexity, not add to it. Also: I’m convinced that software for trades and small businesses is still
                  stuck in the ‘90s — and I’d like to help change that.
                </p>
              </div>
            </div>
            <div>

            </div>
          </div>
        </div>
      </main>
      <footer>

      </footer>
    </HydrateClient>
  );
}
