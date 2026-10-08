"use client";

import Link from "next/link";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import {
  ArrowRight,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  ChevronDown,
  Coins,
  CreditCard,
  FileText,
  House,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { PRODUCT, ROUTES } from "@/config/product";
import { Avatar, cx } from "./ui";

const pagesBasePath = process.env.NEXT_PUBLIC_PAGES_BASE_PATH || "";

function subscribeToTheme(onChange: () => void) {
  window.addEventListener("tg-theme-change", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("tg-theme-change", onChange);
    window.removeEventListener("storage", onChange);
  };
}

function currentTheme(): "light" | "dark" {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="Task Genie home">
      <Image
        className="tg-logo tg-logo-light"
        src={`${pagesBasePath}/brand/task-genie-light.png`}
        alt="Task Genie"
        width={240}
        height={95}
        loading="eager"
        unoptimized
      />
      <Image
        className="tg-logo tg-logo-dark"
        src={`${pagesBasePath}/brand/task-genie-dark.png`}
        alt=""
        aria-hidden="true"
        width={240}
        height={95}
        loading="eager"
        unoptimized
      />
    </Link>
  );
}

function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    currentTheme,
    () => "light",
  );

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.dispatchEvent(new Event("tg-theme-change"));
    try {
      localStorage.setItem("tg-theme", nextTheme);
    } catch {
      // The preview remains usable when browser storage is unavailable.
    }
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-pressed={theme === "dark"}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export function Header({
  path,
  appMode,
  mobileOpen,
  setMobileOpen,
}: {
  path: string;
  appMode: boolean;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}) {
  const employer = path.startsWith("/employer");
  const publicLinks = [
    ["Find jobs", ROUTES.jobs],
    ["Find talent", ROUTES.talent],
    ["Managed VAs", ROUTES.spacecrew],
    ["Waitlist", ROUTES.waitlist],
    ["How it works", ROUTES.howItWorks],
    ...(path === ROUTES.spacecrew ? [] : [["Pricing", ROUTES.pricing]]),
  ];
  return (
    <header className={cx("site-header", path === "/" && "home-header")}>
      <div className="header-inner">
        <Logo />
        <nav className="public-nav" aria-label="Main navigation">
          {!appMode &&
            publicLinks.map(([label, href]) => (
              <Link
                key={href}
                className={cx(path === href && "active")}
                href={href}
              >
                {label}
              </Link>
            ))}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          {appMode ? (
            <>
              <div className="workspace-switch">
                <Link
                  className={cx(!employer && "active")}
                  href={ROUTES.dashboard}
                >
                  Find work
                </Link>
                <Link className={cx(employer && "active")} href={ROUTES.talent}>
                  Hire talent
                </Link>
              </div>
              <Link
                href={employer ? ROUTES.employerMessages : ROUTES.messages}
                className="icon-button notification-button"
                aria-label="Open messages"
              >
                <Bell size={19} />
                <i />
              </Link>
              <Link
                href={employer ? ROUTES.employerSettings : ROUTES.profile}
                className="profile-button"
                aria-label={
                  employer
                    ? "Open Emma's account settings"
                    : "Open Ana's profile"
                }
              >
                <Avatar
                  name={employer ? "Emma Wilson" : "Ana Mendoza"}
                  tone={employer ? "purple" : "coral"}
                />
                <span>
                  {employer ? "Emma" : "Ana"}
                  <ChevronDown size={13} />
                </span>
              </Link>
            </>
          ) : (
            <>
              <Link className="text-button" href={ROUTES.login}>
                Log in
              </Link>
              <Link className="button small" href={ROUTES.signup}>
                Get started <ArrowRight size={15} />
              </Link>
            </>
          )}
          <button
            className="icon-button menu-button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav
          id="mobile-navigation"
          className="mobile-navigation"
          aria-label="Mobile navigation"
        >
          {[
            ...publicLinks,
            ["Job seeker dashboard", ROUTES.dashboard],
            ["Employer workspace", ROUTES.talent],
            ["Messages", employer ? ROUTES.employerMessages : ROUTES.messages],
            ...(appMode
              ? employer
                ? [
                    ["Shortlist", ROUTES.shortlist],
                    ["Hiring pipeline", ROUTES.pipeline],
                    ["Job posts", ROUTES.employerJobs],
                    ["Post a job", ROUTES.postJob],
                    ["Billing", ROUTES.employerBilling],
                  ]
                : [
                    ["My profile", ROUTES.profile],
                    ["Saved jobs", ROUTES.saved],
                    ["Applications", ROUTES.applications],
                    ["Apply Points", ROUTES.applyPoints],
                    ["Payments", ROUTES.payments],
                  ]
              : [
                  ["Log in", ROUTES.login],
                  ["Get started", ROUTES.signup],
                ]),
            [
              "Account settings",
              employer ? ROUTES.employerSettings : ROUTES.settings,
            ],
          ].map(([label, href]) => (
            <Link href={href} key={label} onClick={() => setMobileOpen(false)}>
              {label}
              <ArrowRight size={16} />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function WorkspaceSidebar({
  path,
  employer,
  applyPoints,
  applicationCount,
}: {
  path: string;
  employer: boolean;
  applyPoints: number;
  applicationCount: number;
}) {
  const links = employer
    ? [
        { label: "Talent search", href: ROUTES.talent, icon: Search },
        {
          label: "Shortlist",
          href: ROUTES.shortlist,
          icon: Bookmark,
          count: "3",
        },
        {
          label: "Hiring pipeline",
          href: ROUTES.pipeline,
          icon: LayoutDashboard,
        },
        {
          label: "Messages",
          href: ROUTES.employerMessages,
          icon: MessageSquare,
          count: "3",
        },
        {
          label: "Job posts",
          href: ROUTES.employerJobs,
          icon: BriefcaseBusiness,
        },
        { label: "Billing", href: ROUTES.employerBilling, icon: CreditCard },
        { label: "Settings", href: ROUTES.employerSettings, icon: Settings },
      ]
    : [
        { label: "Overview", href: ROUTES.dashboard, icon: House },
        { label: "My profile", href: ROUTES.profile, icon: UserRound },
        { label: "Saved jobs", href: ROUTES.saved, icon: Bookmark, count: "4" },
        {
          label: "Applications",
          href: ROUTES.applications,
          icon: FileText,
          count: String(applicationCount),
        },
        {
          label: "Apply Points",
          href: ROUTES.applyPoints,
          icon: Coins,
          count: String(applyPoints),
        },
        {
          label: "Messages",
          href: ROUTES.messages,
          icon: MessageSquare,
          count: "3",
        },
        { label: "Payments", href: ROUTES.payments, icon: CreditCard },
        { label: "Settings", href: ROUTES.settings, icon: Settings },
      ];
  return (
    <aside className="workspace-sidebar">
      <div className="workspace-identity">
        <span className="company-mark">{employer ? "NC" : "AM"}</span>
        <div>
          <strong>{employer ? "Northstar Commerce" : "My workspace"}</strong>
          <small>{employer ? "Pro plan" : "Job seeker account"}</small>
        </div>
      </div>
      <span className="sidebar-label">
        {employer ? "RECRUITING" : "MY WORKSPACE"}
      </span>
      <nav aria-label="Workspace navigation">
        {links.map(({ href, label, icon: Icon, count }) => (
          <Link
            className={cx(
              (path === href ||
                (href === ROUTES.profile && path === ROUTES.verification)) &&
                "active",
            )}
            href={href}
            key={href}
          >
            <Icon size={18} />
            <span>{label}</span>
            {count && <b>{count}</b>}
          </Link>
        ))}
      </nav>
      {employer ? (
        <Link className="button full sidebar-cta" href={ROUTES.postJob}>
          ＋ Post a job
        </Link>
      ) : (
        <Link className="sidebar-tip" href={ROUTES.jobs}>
          <Sparkles size={20} />
          <strong>Your next role is here.</strong>
          <span>Explore opportunities that fit your skills.</span>
          <b>
            Browse jobs <ArrowRight size={14} />
          </b>
        </Link>
      )}
      <div className="sidebar-bottom">
        <Link href={ROUTES.support}>
          <LifeBuoy size={17} />
          Help & resources
        </Link>
        <Link href="/">
          <LogOut size={17} />
          Back to marketplace
        </Link>
      </div>
    </aside>
  );
}

export function Footer({ path }: { path: string }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>
            Connecting professionals worldwide
            <br />
            with teams around the world.
          </p>
          <span>
            <ShieldCheck size={14} />{" "}
            {path === ROUTES.spacecrew
              ? "Managed support. Thoughtful teams."
              : "Remote work. Direct relationships."}
          </span>
        </div>
        <div>
          <strong>For employers</strong>
          <Link href={ROUTES.talent}>Find talent</Link>
          <Link href={ROUTES.postJob}>Post a job</Link>
          <Link href={ROUTES.spacecrew}>Managed VA services</Link>
          {path !== ROUTES.spacecrew && (
            <Link href={ROUTES.pricing}>Plans & pricing</Link>
          )}
          <Link href={ROUTES.howItWorks}>How hiring works</Link>
        </div>
        <div>
          <strong>For professionals</strong>
          <Link href={ROUTES.jobs}>Find remote jobs</Link>
          <Link href={ROUTES.waitlist}>Freelancer waitlist</Link>
          <Link href={ROUTES.profile}>Build your profile</Link>
          <Link href={ROUTES.dashboard}>Your workspace</Link>
          <Link href={ROUTES.applyPoints}>How Apply Points work</Link>
          <Link href={ROUTES.support}>Career resources</Link>
        </div>
        <div>
          <strong>About Task Genie</strong>
          <Link href={ROUTES.about}>Our purpose</Link>
          <Link href={ROUTES.trust}>Trust & safety</Link>
          <Link href={ROUTES.settings}>Privacy controls</Link>
          <Link href={ROUTES.support}>Get in touch</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 {PRODUCT.name}. All rights reserved.</span>
        <span>Product preview · Sample listings</span>
      </div>
    </footer>
  );
}
