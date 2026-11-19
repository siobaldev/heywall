"use client";

import { useState } from "react";
import Image from "next/image";
import { ListIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { PROFILE } from "@/lib/profile";

const NAV_LINKS = ["Home", "Profile", "Friends", "Inbox"];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="mx-auto rounded-b-sm bg-primary px-4 py-4 text-white">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:flex-nowrap">
        <Image
          src="/logo-name.svg"
          alt="Heywall"
          loading="eager"
          width={100}
          height={100}
          className="mr-auto h-auto w-40 lg:mr-0"
        />

        {/* Desktop nav */}
        <nav className="hidden gap-x-5 lg:mr-auto lg:flex">
          {NAV_LINKS.map((link) => (
            <a key={link} href="#">
              {link}
            </a>
          ))}
        </nav>

        {/* Desktop logout */}
        <a href="#" className="hidden lg:block">
          Logout
        </a>

        {/* Search: row 2 on mobile, inline on tablet and up */}
        <div className="order-2 flex h-13 w-full items-center rounded-sm bg-white px-6 text-foreground sm:order-1 sm:w-70 lg:order-0">
          <input
            placeholder="Search"
            className="w-full min-w-0 bg-transparent outline-none placeholder:text-foreground/80"
          />
          <MagnifyingGlassIcon size={24} aria-hidden />
        </div>

        {/* Hamburger / close */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="order-1 lg:hidden"
        >
          {open ? <XIcon size={32} /> : <ListIcon size={32} />}
        </button>
      </div>

      {/* Menu panel (below lg) */}
      {open && (
        <div
          id="mobile-menu"
          className="mt-6 flex flex-col items-center gap-y-8 pb-6 sm:mt-5 sm:justify-between sm:flex-row sm:pb-0 lg:hidden"
        >
          <nav className="order-2 flex flex-col items-center gap-y-5 sm:order-1 sm:pr-5 sm:flex-row sm:gap-x-5">
            {NAV_LINKS.map((link) => (
              <a key={link} href="#" onClick={() => setOpen(false)}>
                {link}
              </a>
            ))}
          </nav>

          <div className="contents sm:order-2 sm:flex sm:w-86 sm:items-center sm:justify-between">
            <div className="order-1 flex flex-col items-center gap-y-2 sm:flex-row sm:gap-x-2">
              <img
                src={PROFILE.avatar}
                alt={PROFILE.name}
                className="size-11 rounded-sm object-cover"
              />
              <span className="">{PROFILE.name}</span>
            </div>

            <a href="#" className="order-3">
              Logout
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
