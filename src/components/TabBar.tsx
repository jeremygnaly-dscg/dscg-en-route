"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./tabbar.module.css";

const TABS = [
  { href: "/app/fil", label: "Fil", icon: <path d="M4 5h16M4 12h16M4 19h10" /> },
  { href: "/app", label: "Réviser", icon: <><path d="M5 19V9a7 7 0 0 1 14 0v10" /><rect x="3" y="14" width="5" height="7" rx="2" /><rect x="16" y="14" width="5" height="7" rx="2" /></> },
  { href: "/app/quiz", label: "Quiz", icon: <><path d="M8 4h8v5a4 4 0 0 1-8 0z" /><path d="M8 6H5a2 2 0 0 0 2 4M16 6h3a2 2 0 0 1-2 4M12 13v4M8 21h8" /></> },
  { href: "/app/profil", label: "Profil", icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></> },
];

export function TabBar() {
  const path = usePathname() ?? "";
  const active = (href: string) =>
    href === "/app" ? path === "/app" || path.startsWith("/episode") : path.startsWith(href);
  return (
    <nav className={styles.bar} aria-label="Navigation principale">
      {TABS.map((t) => (
        <Link key={t.href} href={t.href} className={styles.tab} aria-current={active(t.href) ? "page" : undefined}>
          <svg viewBox="0 0 24 24" aria-hidden="true">{t.icon}</svg>
          <span>{t.label}</span>
        </Link>
      ))}
    </nav>
  );
}
