import { Card } from "~/app/components/cards/card";
import Link from "next/link";

export function AboutMe() {
  return (
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
  )
}