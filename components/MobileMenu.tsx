"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Props = {
  nav: { name: string; href: string }[];
  cities: { slug: string; name: string }[];
};

/** Full-screen menu for phones and tablets. */
export function MobileMenu({ nav, cities }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close when the page changes
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Lock page scroll while open, close on Escape
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="label relative z-50 flex h-10 items-center gap-2.5 text-ink"
      >
        <span>{open ? "Close" : "Menu"}</span>
        <span aria-hidden className="relative block h-2.5 w-5">
          <span
            className={`absolute left-0 h-px w-5 bg-ink transition-transform duration-300 ${open ? "top-1/2 rotate-45" : "top-0"}`}
          />
          <span
            className={`absolute left-0 h-px w-5 bg-ink transition-transform duration-300 ${open ? "top-1/2 -rotate-45" : "bottom-0"}`}
          />
        </span>
      </button>

      <div
        id="mobile-menu"
        inert={!open}
        className={`fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-paper transition-[opacity,visibility] duration-300 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="mx-auto flex min-h-full max-w-[1320px] flex-col px-4 pt-6 pb-10 sm:px-6">
          <form action="/search" role="search" className="border-b border-ink">
            <label htmlFor="mobile-search" className="sr-only">
              Search
            </label>
            <input
              id="mobile-search"
              name="q"
              type="search"
              placeholder="Search stories, cities, tags"
              className="w-full bg-transparent py-3 font-serif text-xl placeholder:text-muted focus:outline-none"
            />
          </form>

          <nav aria-label="Sections" className="mt-8">
            <ul>
              {nav.map((item, i) => (
                <li
                  key={item.href}
                  className={`border-b border-line transition-[opacity,transform] duration-500 ${
                    open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                  style={{ transitionDelay: open ? `${60 + i * 40}ms` : "0ms" }}
                >
                  <Link href={item.href} className="flex items-baseline gap-4 py-3.5">
                    <span className="label w-6 text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-serif text-[2rem] leading-tight tracking-[-0.01em]">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-10">
            <p className="label text-muted">Cities</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {cities.map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}`} className="font-serif text-xl italic hover:text-accent">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-12 text-sm text-muted">
            <Link href="/about">About</Link>
            <Link href="/partner-with-us">Partner With Us</Link>
            <Link href="/contact">Contact</Link>
            <Link href="#newsletter" onClick={() => setOpen(false)} className="font-medium text-ink">
              Subscribe
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
