"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { aboutData } from "@/data/about.data";
import { contactData } from "@/data/contact.data";
import { socialData } from "@/data/socials.data";
import { Icon, type IconName } from "./icon";
import { Slide } from "./Motion";

const profileCard = [
  { label: "Role", value: aboutData.role },
  { label: "Location", value: aboutData.location },
  { label: "Status", value: aboutData.status },
];

type CardMotionProps = Readonly<{
  open: boolean;
}>;

export function VerticalNameCard({ open }: CardMotionProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="profile-card"
          role="tooltip"
          className="pointer-events-none fixed top-4 left-4 z-40 flex w-[min(17rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl bg-inverse text-base shadow-2xl xl:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="aspect-4 w-full shrink-0 bg-muted/30">
            <Image
              src={aboutData.portrait}
              alt={`Portrait of ${aboutData.fullName}`}
              width={188}
              height={235}
              sizes="320px"
              className="h-full w-full object-cover object-top"
            />
          </div>
          <dl className="flex flex-1 flex-col justify-center space-y-3 p-4">
            {profileCard.map((r) => (
              <div key={r.label}>
                <dt className="t8 text-base/65">{r.label}</dt>
                <dd className="leading-snug text-base">{r.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function HorizontalNameCard({ open }: CardMotionProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="profile-card-desktop"
          role="tooltip"
          className="pointer-events-none fixed top-4 left-4 z-40 hidden w-[min(32rem,calc(100vw-2rem))] overflow-hidden rounded-xl bg-inverse text-base shadow-2xl xl:flex xl:flex-row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="aspect-4/5 w-[42%] shrink-0 bg-muted/30">
            <Image
              src={aboutData.portrait}
              alt={`Portrait of ${aboutData.fullName}`}
              width={188}
              height={235}
              sizes="188px"
              className="h-full w-full object-cover object-top"
            />
          </div>
          <dl className="flex flex-1 flex-col justify-center space-y-3 p-4">
            {profileCard.map((r) => (
              <div key={r.label}>
                <dt className="t8 text-base/65">{r.label}</dt>
                <dd className="leading-snug text-base">{r.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Hero() {
  const [open, setOpen] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  const nameTitle = [aboutData.firstName, aboutData.lastName].map(
    (line, index) => (
      <Slide
        key={line}
        delay={index * 0.2}
        className="hero-name-line t1 block pr-[5%] text-left md:max-w-2xl lg:max-w-none"
      >
        {line}
      </Slide>
    ),
  );

  useEffect(() => {
    if (!open) return;
    const away = (e: Event) => {
      if (!profileButtonRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", away);
    return () => window.removeEventListener("pointerdown", away);
  }, [open]);

  return (
    <section id="top" className="relative flex flex-col px-[5%] pt-24 pb-48">
      <h1>{nameTitle}</h1>

      <VerticalNameCard open={open} />
      <HorizontalNameCard open={open} />

      <Slide
        animation="slide-up-short-summary"
        className="t4 block pt-8 xl:pr-[23%]"
      >
        {aboutData.shortSummary}
      </Slide>

      <nav
        aria-label="Resume and contact links"
        className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3 xl:absolute xl:top-24 xl:right-[5%] xl:mt-0 xl:flex-col"
      >
        <a
          href={aboutData.resume}
          download="Mian_Hamid_Ur_Rehman_CV.pdf"
          aria-label="Download CV"
          title="Download CV"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-inverse text-base transition-colors hover:bg-primary md:size-20 xl:mb-2"
        >
          <Icon name="fileDownload" className="size-6 md:size-10" />
        </a>
        {[
          ...socialData.filter((social) => social.icon === "mail"),
          ...socialData.filter((social) => social.icon !== "mail"),
          { label: "Phone", href: contactData.phoneHref, icon: "phone" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            aria-label={link.label}
            title={link.label}
            target={link.href.startsWith("https://") ? "_blank" : undefined}
            rel={
              link.href.startsWith("https://")
                ? "noopener noreferrer"
                : undefined
            }
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-inverse transition-colors hover:bg-inverse hover:text-base md:size-16"
          >
            <Icon name={link.icon as IconName} className="size-6 md:size-8" />
          </a>
        ))}

        <button
          ref={profileButtonRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
          onBlur={() => setOpen(false)}
          aria-expanded={open}
          aria-controls="profile-card profile-card-desktop"
          aria-label="Show Profile Card"
          title="Show Profile Card"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-inverse text-base transition-colors hover:bg-primary md:size-20 xl:mb-2"
        >
          <Icon name="profile" className="size-6 md:size-10" />
        </button>
      </nav>
    </section>
  );
}
