import { useEffect, useId, useState, type ReactNode } from "react";
import "../brand-fonts.css";
import "../paper.css";

// The frame the landing page uses (index.html), for the older pages its footer links to: a link
// home, the light / dark toggle sharing the landing page's remembered choice, and the same footer.

const THEME_KEY = "ctf-theme";
type Theme = "light" | "dark";

function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const SE_MARK_PATH =
  "m94 105.7h-26v-7.7h25.5c1.5-0.1 3.1-1.3 3.1-3.3v-11.7c0-1.5-1.2-2.9-2.8-2.9l-22.5-0.1c-1.7 0-3.3 1.4-3.3 3.1l0.1 9.7h-24.8c-1.6 0-3 1.3-3 2.9v12.9h-25.7c-1.6 0-3.1 1.3-3.1 2.9v8.1c0 1.4 1.2 2.7 2.6 2.7h79.9c1.5 0 2.8-1.3 2.9-2.7v-11.3c-0.2-1.3-1.4-2.6-2.9-2.6zm-0.2 21.2h-79.3c-1.4 0-2.9 1.2-2.9 2.8v8.3c0 1.4 1.2 3 2.8 3h79.6c1.6 0 2.8-1.3 2.8-2.8v-8c0-1.8-1.4-3.2-3-3.3z";

// The Skills Economy mark, in this site's burgundy (--mark-a / --mark-b in paper.css).
function SeMark() {
  const id = useId();
  return (
    <svg viewBox="4 67.9 100 85" aria-hidden="true">
      <linearGradient id={id} x1="11.51" x2="96.71" y1="110.4" y2="110.4" gradientUnits="userSpaceOnUse">
        <stop offset="0" style={{ stopColor: "var(--mark-a)" }} />
        <stop offset="1" style={{ stopColor: "var(--mark-b)" }} />
      </linearGradient>
      <path fill={`url(#${id})`} d={SE_MARK_PATH} />
    </svg>
  );
}

export function PaperShell({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(THEME_KEY);
    } catch {
      /* storage refused: follow the phone's setting */
    }
    if (saved === "light" || saved === "dark") document.documentElement.dataset.theme = saved;
    setTheme(currentTheme());
  }, []);

  function pick(next: Theme) {
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* not remembered on this phone */
    }
  }

  return (
    <div className="pp">
      <main className="pp-wrap">
        <div className="pp-top">
          {/* A full page load: "/" is the match page, which is not part of this app. */}
          <a href="/">
            &larr; <SeMark /> Skills Economy
          </a>
          <div className="pp-theme" role="group" aria-label="Theme">
            <button type="button" aria-pressed={theme === "light"} onClick={() => pick("light")}>Light</button>
            <button type="button" aria-pressed={theme === "dark"} onClick={() => pick("dark")}>Dark</button>
          </div>
        </div>
        {children}
        <footer className="pp-foot">
          <nav aria-label="More from Skills Economy">
            <a href="/look-ma">Look Ma, I Fixed It</a>
            <a href="/schemes">The Schemes</a>
            <a href="https://chargingthefuture.github.io/chargingthefuture/feed">People on the list</a>
            <a href="https://app.chargingthefuture.com/guide">Guide</a>
            <a href="https://app.chargingthefuture.com/terms">Terms</a>
            <a href="https://github.com/chargingthefuture/chargingthefuture/releases?q=mobile" target="_blank" rel="noopener noreferrer">Android APK</a>
            <a href="https://github.com/chargingthefuture/chargingthefuture/releases?q=wallpapers" target="_blank" rel="noopener noreferrer">Wallpapers</a>
          </nav>
        </footer>
      </main>
    </div>
  );
}
