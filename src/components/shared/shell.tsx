"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  ChevronDown,
  CreditCard,
  FileText,
  House,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { PRODUCT, ROUTES } from "@/config/product";
import { Avatar, cx } from "./ui";

export function Logo() {
  return (
    <Link className="logo" href="/">
      <span className="logo-mark">
        <Sparkles size={21} />
      </span>
      <span>
        task<span className="logo-accent">genie</span>
        <i />
      </span>
    </Link>
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
    ["How it works", ROUTES.howItWorks],
    ["Pricing", ROUTES.pricing],
  ];
  return (
    <header className="site-header">
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
}: {
  path: string;
  employer: boolean;
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
          count: "4",
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

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>
            Connecting Filipino professionals
            <br />
            with teams around the world.
          </p>
          <span>
            <ShieldCheck size={14} /> Remote work. Direct relationships.
          </span>
        </div>
        <div>
          <strong>For employers</strong>
          <Link href={ROUTES.talent}>Find talent</Link>
          <Link href={ROUTES.postJob}>Post a job</Link>
          <Link href={ROUTES.pricing}>Plans & pricing</Link>
          <Link href={ROUTES.howItWorks}>How hiring works</Link>
        </div>
        <div>
          <strong>For professionals</strong>
          <Link href={ROUTES.jobs}>Find remote jobs</Link>
          <Link href={ROUTES.profile}>Build your profile</Link>
          <Link href={ROUTES.dashboard}>Your workspace</Link>
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
