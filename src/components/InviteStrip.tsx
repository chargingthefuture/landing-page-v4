import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// A row of the newest ten invitations, one card each, newest first, then a card that leads to the
// Directory. It reads the app's public invite feed. Nothing here decides what an invite is; the app
// does. Until the feed answers there is no row; if it fails, the row is the Directory card alone.
//
// Nothing moves on its own. The row scrolls by touch, by the two buttons, or by keyboard, and
// every card is in the page for a screen reader. Owner decision, 2026-09-19.

const APP_URL = "https://app.chargingthefuture.com";
const INVITES_URL = `${APP_URL}/api/directory/invites/public`;
const DIRECTORY_URL = `${APP_URL}/apps/directory`;
const MAX_CARDS = 10;

type InviteCard = {
  name: string;
  url: string;
  date: string;
  opening: string;
};

type FeedState = { status: "loading" } | { status: "ready"; invites: InviteCard[]; listed: number | null };

/** Keeps only well-formed cards whose link goes into the app, so a bad row cannot become a bad link. */
function readInvites(value: unknown): InviteCard[] {
  if (!Array.isArray(value)) return [];
  const cards: InviteCard[] = [];
  for (const row of value) {
    if (!row || typeof row !== "object") continue;
    const { name, opening, date, url } = row as Record<string, unknown>;
    if (typeof name !== "string" || !name.trim()) continue;
    if (typeof url !== "string" || !url.startsWith(`${APP_URL}/`)) continue;
    cards.push({
      name: name.trim(),
      opening: typeof opening === "string" ? opening.trim() : "",
      date: typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "",
      url,
    });
  }
  return cards.slice(0, MAX_CARDS);
}

function formatDate(iso: string): string {
  const at = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(at.getTime())) return iso;
  return at.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export function InviteStrip() {
  const [feed, setFeed] = useState<FeedState>({ status: "loading" });
  const rowRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let canceled = false;
    fetch(INVITES_URL, { headers: { accept: "application/json" } })
      .then((res) => (res.ok ? res.json() : {}))
      .then((data: { invites?: unknown; listed?: unknown }) => {
        if (canceled) return;
        const listed =
          typeof data.listed === "number" && Number.isFinite(data.listed) && data.listed > 0
            ? Math.floor(data.listed)
            : null;
        setFeed({ status: "ready", invites: readInvites(data.invites), listed });
      })
      .catch(() => {
        if (!canceled) setFeed({ status: "ready", invites: [], listed: null });
      });
    return () => {
      canceled = true;
    };
  }, []);

  if (feed.status === "loading") return null;
  const { invites, listed } = feed;
  const listedText = listed ? listed.toLocaleString("en-US") : "300+";

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
            Each card is an invitation to somebody listed in the Directory, so they can decide in their own time. The newest are here, and every one is in the app.
          </p>
        </div>
        {invites.length > 0 ? (
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
        aria-label={
          invites.length > 0
            ? `${invites.length} newest invitations, newest first, then a link to every invitation`
            : "A link to every invitation"
        }
      >
        {invites.map((invite) => (
          <li key={invite.url} className="snap-start shrink-0 w-[85vw] max-w-xs sm:w-80">
            <article
              className="h-full flex flex-col p-5 border-4 border-foreground bg-card"
              style={{ boxShadow: "4px 4px 0px 0px hsl(var(--primary))" }}
            >
              {invite.date ? (
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{formatDate(invite.date)}</span>
              ) : null}
              <h3 className="font-display text-2xl uppercase leading-tight mb-3">An invitation to {invite.name}</h3>
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
        <li className="snap-start shrink-0 w-[85vw] max-w-xs sm:w-80">
          <article
            className="h-full flex flex-col p-5 border-4 border-foreground bg-card"
            style={{ boxShadow: "4px 4px 0px 0px hsl(var(--primary))" }}
          >
            <h3 className="font-display text-2xl uppercase leading-tight mb-3">Sign in to see every invitation</h3>
            <p className="text-muted-foreground leading-relaxed flex-grow">
              The free directory of {listedText} self-identified Targeted Individuals.
            </p>
            <a
              href={DIRECTORY_URL}
              rel="noopener noreferrer"
              className="mt-4 font-bold uppercase tracking-widest text-primary hover:underline underline-offset-4"
            >
              Open the Directory →
            </a>
          </article>
        </li>
      </ul>
    </section>
  );
}
