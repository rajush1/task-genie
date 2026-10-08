"use client";

import Link from "next/link";
import { useState } from "react";
import { BadgeCheck, Check, FileText, ShieldCheck, Upload } from "lucide-react";
import type { MarketplaceState } from "@/domain/types";
import type { DemoStateUpdater } from "@/state/use-demo-state";
import { ROUTES } from "@/config/product";
import {
  AppLayout,
  Avatar,
  Badge,
  Notice,
  PageHeading,
  PortfolioTiles,
  SkillTags,
  TextField,
} from "@/components/shared";

export function ProfilePage({
  state,
  setState,
}: {
  state: MarketplaceState;
  setState: DemoStateUpdater;
}) {
  const [notice, setNotice] = useState(false);
  return (
    <AppLayout>
      <PageHeading
        eyebrow="MY PROFILE"
        title="Let your work speak for you."
        text="A clear picture of your skills, experience, and the work you want to do."
        action={
          <Link className="button secondary" href={ROUTES.verification}>
            <ShieldCheck size={16} />
            Verification & resume
          </Link>
        }
      />
      <div className="profile-layout">
        <form
          className="form-card profile-form"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            setNotice(true);
          }}
        >
          <div className="profile-cover">
            <span className="eyebrow">AVAILABLE FOR REMOTE WORK</span>
            <Badge tone="neutral">Public profile</Badge>
          </div>
          <div className="profile-banner">
            <Avatar name="Ana Mendoza" tone="coral" large />
            <div>
              <h2>
                Ana Mendoza <BadgeCheck size={19} />
              </h2>
              <p>Toronto, Canada · Member since 2021</p>
            </div>
          </div>
          <h3>Professional introduction</h3>
          <TextField
            label="Professional headline"
            value={state.profile.headline}
            placeholder="Executive Virtual Assistant | Shopify & Notion"
            onChange={(event) =>
              setState((previous) => ({
                ...previous,
                profile: { ...previous.profile, headline: event.target.value },
              }))
            }
          />
          <label className="field-label">
            About my work
            <textarea
              value={state.profile.bio}
              placeholder="Describe your experience, strengths, and recent results."
              onChange={(event) =>
                setState((previous) => ({
                  ...previous,
                  profile: { ...previous.profile, bio: event.target.value },
                }))
              }
            />
          </label>
          <h3>Availability & compensation</h3>
          <div className="form-grid">
            <label className="field-label">
              Looking for
              <select>
                <option>Full-time work</option>
                <option>Part-time work</option>
                <option>Project / contract work</option>
              </select>
            </label>
            <TextField label="Weekly hours" defaultValue="40 hours" />
            <TextField label="Desired monthly pay" defaultValue="$1,200 USD" />
            <label className="field-label">
              Available to start
              <select>
                <option>Immediately</option>
                <option>In 2 weeks</option>
                <option>In 1 month</option>
              </select>
            </label>
          </div>
          <h3>Skills & background</h3>
          <TextField
            label="Top skills"
            defaultValue={state.profile.skills.join(", ")}
            placeholder="Executive support, Shopify, Notion"
          />
          <SkillTags skills={state.profile.skills} />
          <div className="form-grid">
            <label className="field-label">
              English level
              <select>
                <option>C1 · Advanced</option>
                <option>C2 · Proficient</option>
                <option>B2 · Upper intermediate</option>
              </select>
            </label>
            <TextField
              label="Education"
              defaultValue="BS Business Administration"
            />
          </div>
          <h3>Experience</h3>
          <div className="experience-card">
            <span className="company-mark">BC</span>
            <div>
              <h4>Executive Assistant & Customer Operations</h4>
              <strong>Brightline Commerce · Remote</strong>
              <span>March 2021 – September 2026</span>
              <p>
                Managed founder schedules, coordinated customer support, and
                maintained Shopify product listings. Built a support playbook
                that reduced first-response time by 75%.
              </p>
            </div>
          </div>
          <h3>Portfolio & selected work</h3>
          <TextField
            label="Portfolio website"
            value={state.profile.portfolio}
            placeholder="https://anamendoza.com/portfolio"
            onChange={(event) =>
              setState((previous) => ({
                ...previous,
                profile: { ...previous.profile, portfolio: event.target.value },
              }))
            }
          />
          <PortfolioTiles
            items={[
              "E-commerce operations dashboard",
              "Customer support playbook",
            ]}
          />
          <div className="form-actions">
            <span className="quiet-note">Updated October 7, 2026</span>
            <button className="button">
              Save profile <Check size={16} />
            </button>
          </div>
          {notice && <Notice>Your profile updates have been saved.</Notice>}
        </form>
        <aside className="profile-sidebar">
          <div className="card">
            <span className="eyebrow">PROFILE STRENGTH</span>
            <div className="completion-score">
              100<span>%</span>
            </div>
            <h3>Looking good, Ana.</h3>
            <p>
              Employers have the details they need to get to know your work.
            </p>
            <div className="profile-checklist">
              {[
                "Professional introduction",
                "Availability & expected pay",
                "Top skills & experience",
                "Portfolio & resume",
                "Verified identity",
              ].map((item) => (
                <span key={item}>
                  <Check size={15} />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="card profile-visibility">
            <ShieldCheck size={22} />
            <h3>Your privacy matters.</h3>
            <p>Choose what employers can see and when they can contact you.</p>
            <Link className="text-link" href={ROUTES.settings}>
              Review privacy settings
            </Link>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}

export function VerificationPage({
  setState,
}: {
  state: MarketplaceState;
  setState: DemoStateUpdater;
}) {
  const [notice, setNotice] = useState(false);
  return (
    <AppLayout>
      <PageHeading
        eyebrow="VERIFICATION & RESUME"
        title="Give your profile a little more confidence."
        text="Your qualifications, work history, and verification details in one place."
      />
      <div className="verification-grid">
        {[
          {
            title: "Identity verification",
            text: "Identity check completed on October 5, 2026.",
            icon: BadgeCheck,
          },
          {
            title: "Email address",
            text: "ana.mendoza@outlook.com · Confirmed",
            icon: Check,
          },
          {
            title: "English proficiency",
            text: "C1 · Advanced · Professional working proficiency",
            icon: FileText,
          },
          {
            title: "Profile information",
            text: "Name, location, and availability are up to date.",
            icon: ShieldCheck,
          },
        ].map(({ title, text, icon: Icon }) => (
          <article className="card verification-card" key={title}>
            <span className="feature-icon">
              <Icon size={22} />
            </span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
            <Badge>
              <Check size={13} />
              Complete
            </Badge>
          </article>
        ))}
      </div>
      <div className="resume-layout">
        <section className="card resume-card">
          <div className="section-heading">
            <div>
              <h2>Your resume</h2>
              <p>A concise snapshot of your experience.</p>
            </div>
            <Badge>Attached to profile</Badge>
          </div>
          <div className="attachment-row">
            <FileText size={27} />
            <div>
              <strong>Ana-Mendoza-Resume.pdf</strong>
              <small>PDF · 245 KB · Updated October 6, 2026</small>
            </div>
            <button
              className="button secondary"
              onClick={() => {
                setState((previous) => ({
                  ...previous,
                  profile: { ...previous.profile, resume: true },
                }));
                setNotice(true);
              }}
            >
              <Upload size={16} />
              Replace resume
            </button>
          </div>
          <div className="resume-preview">
            <div>
              <h2>ANA MENDOZA</h2>
              <p>Executive Virtual Assistant · E-commerce Operations</p>
              <span>Toronto, Canada · ana.mendoza@outlook.com</span>
            </div>
            <h4>PROFESSIONAL SUMMARY</h4>
            <p>
              Five years supporting remote founders with executive scheduling,
              customer care, Shopify catalog management, and process
              documentation.
            </p>
            <h4>EXPERIENCE</h4>
            <strong>Executive Assistant & Customer Operations</strong>
            <span>Brightline Commerce | 2021–2026</span>
            <ul>
              <li>
                Coordinated executive calendars across North American and
                European time zones.
              </li>
              <li>
                Maintained Shopify listings and supported daily order
                operations.
              </li>
              <li>
                Reduced first-response time by creating a structured support
                playbook.
              </li>
            </ul>
            <h4>SKILLS & EDUCATION</h4>
            <p>
              Shopify · Notion · Google Workspace · Customer Support
              <br />
              BS Business Administration · University of San Carlos
            </p>
          </div>
          {notice && (
            <Notice>Your updated resume is attached to your profile.</Notice>
          )}
        </section>
        <aside className="card">
          <ShieldCheck className="teal" size={25} />
          <h3>What employers can see</h3>
          <p>
            Your verification badge, English level, and resume are visible on
            your professional profile.
          </p>
          <p>
            Your identity documents and personal verification records remain
            private.
          </p>
          <Link className="button secondary full" href={ROUTES.profile}>
            Back to my profile
          </Link>
        </aside>
      </div>
    </AppLayout>
  );
}
