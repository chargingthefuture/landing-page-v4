import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// A row of the blog's published invite posts, one card each, newest first. It reads the blog's
// own build output, invites.json, served by GitHub Pages with an open CORS header. Nothing here
// decides what an invite is; the blog does. Renders nothing when the file cannot be read.
//
// Nothing moves on its own. The row scrolls by touch, by the two buttons, or by keyboard, and
// every card is in the page for a screen reader. Owner decision, 2026-09-19.

const INVITES_URL = "https://chargingthefuture.github.io/chargingthefuture/invites.json";

type InviteCard = {
  name: string;
  title: string;
  url: string;
  date: string;
  opening: string;
};

function formatDate(iso: string): string {
  const at = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(at.getTime())) return iso;
  return at.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export function InviteStrip() {
  const [invites, setInvites] = useState<InviteCard[]>([]);
  const rowRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let canceled = false;
    fetch(INVITES_URL, { headers: { accept: "application/json" } })
      .then((res) => (res.ok ? res.json() : { invites: [] }))
      .then((data: { invites?: InviteCard[] }) => {
        if (canceled) return;
        setInvites(Array.isArray(data.invites) ? data.invites : []);
      })
      .catch(() => {
        /* additive: no file, no row */
      });
    return () => {
      canceled = true;
    };
  }, []);

  if (invites.length === 0) return null;

  function scrollByCard(direction: -1 | 1) {
    const row = rowRef.current;
    if (!row) return;
    const card = row.querySelector<HTMLElement>("li");
    const step = card ? card.getBoundingClientRect().width + 16 : row.clientWidth * 0.9;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    row.scrollBy({ left: direction * step, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <section
      aria-labelledby="invite-strip-heading"
      className="py-16 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto"
    >
      <div className="flex items-end justify-between gap-4 mb-6">
        <div className="max-w-2xl">
          <h2 id="invite-strip-heading" className="font-display text-3xl md:text-4xl uppercase tracking-wider">
            People already <span className="text-primary">on the list</span>
          </h2>
          <p className="text-muted-foreground mt-2">
            Each card is an open invitation to somebody listed in the Directory, written in public so they can decide in their own time.
          </p>
        </div>
        {invites.length > 1 ? (
          <div className="hidden sm:flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              className="w-11 h-11 flex items-center justify-center border-4 border-foreground bg-card hover:bg-primary hover:text-black focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
              aria-label="Show the previous invitations"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              className="w-11 h-11 flex items-center justify-center border-4 border-foreground bg-card hover:bg-primary hover:text-black focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
              aria-label="Show the next invitations"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        ) : null}
      </div>

      <ul
        ref={rowRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 md:mx-0 md:px-0 scroll-smooth motion-reduce:scroll-auto"
        aria-label={`${invites.length} invitations, newest first`}
      >
        {invites.map((invite) => (
          <li key={invite.url} className="snap-start shrink-0 w-[85vw] max-w-xs sm:w-80">
            <article
              className="h-full flex flex-col p-5 border-4 border-foreground bg-card"
              style={{ boxShadow: "4px 4px 0px 0px hsl(var(--primary))" }}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{formatDate(invite.date)}</span>
              <h3 className="font-display text-2xl uppercase leading-tight mb-3">{invite.title}</h3>
              <p className="text-muted-foreground leading-relaxed flex-grow">{invite.opening}</p>
              <a
                href={invite.url}
                rel="noopener noreferrer"
                className="mt-4 font-bold uppercase tracking-widest text-primary hover:underline underline-offset-4"
              >
                Read the invitation →
              </a>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
