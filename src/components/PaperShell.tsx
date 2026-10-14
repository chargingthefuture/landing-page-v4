import { useEffect, useState, type ReactNode } from "react";
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
          <a href="/">&larr; Skills Economy</a>
          <div className="pp-theme" role="group" aria-label="Theme">
            <button type="button" aria-pressed={theme === "light"} onClick={() => pick("light")}>Light</button>
            <button type="button" aria-pressed={theme === "dark"} onClick={() => pick("dark")}>Dark</button>
          </div>
        </div>
        {children}
        <footer className="pp-foot">
          <nav aria-label="More from Charging The Future">
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
