"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNonLus } from "@/lib/reseau";
import styles from "./tabbar.module.css";

const TABS = [
  { href: "/app/fil", label: "Fil", icon: <path d="M4 5h16M4 12h16M4 19h10" /> },
  { href: "/app", label: "Réviser", icon: <><path d="M5 19V9a7 7 0 0 1 14 0v10" /><rect x="3" y="14" width="5" height="7" rx="2" /><rect x="16" y="14" width="5" height="7" rx="2" /></> },
  { href: "/app/coach", label: "Coach", icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></> },
  { href: "/app/communaute", label: "Communauté", icon: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><circle cx="17" cy="9" r="2.8" /><path d="M16 14.2a5.5 5.5 0 0 1 6 5.8" /></> },
  { href: "/app/profil", label: "Profil", icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></> },
];

export function TabBar() {
  const path = usePathname() ?? "";
  const nonLus = useNonLus();
  const active = (href: string) =>
    href === "/app" ? path === "/app" || path.startsWith("/episode") : path.startsWith(href);
  return (
    <nav className={styles.bar} aria-label="Navigation principale">
      {TABS.map((t) => (
        <Link key={t.href} href={t.href} className={styles.tab} aria-current={active(t.href) ? "page" : undefined}>
          <svg viewBox="0 0 24 24" aria-hidden="true">{t.icon}</svg>
          {t.href === "/app/communaute" && nonLus > 0 && <i className={styles.badge} aria-label={`${nonLus} messages non lus`}>{nonLus}</i>}
          <span>{t.label}</span>
        </Link>
      ))}
    </nav>
  );
}
