"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Check,
  Code2,
  Headphones,
  Palette,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { jobCategories, jobs } from "@/data/fixtures";
import { ROUTES } from "@/config/product";
import {
  Avatar,
  Badge,
  cx,
  JobCard,
  SectionHeading,
} from "@/components/shared";

const categoryIcons = [
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Palette,
  Code2,
  Headphones,
  Wallet,
  ShoppingBag,
  Users,
];

export function Home() {
  const [mode, setMode] = useState("talent");
  const [query, setQuery] = useState("Executive assistant");
  const router = useRouter();
  return (
    <div className="home-page">
      <section className="hero container">
        <div className="hero-copy">
          <span className="hero-kicker">
            <span className="pulse-dot" />
            REMOTE OPPORTUNITIES. REAL CONNECTIONS.
          </span>
          <h1>
            Great people.
            <br />
            Meaningful work.
            <br />
            <em>Made possible.</em>
          </h1>
          <p>
            Connect with skilled Filipino professionals and global teams. Find
            the right fit for a full-time role, a part-time opportunity, or your
            next big project.
          </p>
          <div className="hero-search">
            <div className="search-tabs">
              <button
                className={cx(mode === "talent" && "active")}
                onClick={() => setMode("talent")}
              >
                <Users size={16} />
                I’m hiring
              </button>
              <button
                className={cx(mode === "jobs" && "active")}
                onClick={() => setMode("jobs")}
              >
                <BriefcaseBusiness size={16} />
                I’m looking for work
              </button>
            </div>
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                router.push(
                  mode === "jobs"
                    ? `/jobs?q=${encodeURIComponent(query)}`
                    : `${ROUTES.talent}?q=${encodeURIComponent(query)}`,
                );
              }}
            >
              <Search size={19} />
              <input
                aria-label="Search role or skill"
                value={query}
                placeholder="Executive assistant, Shopify, or social media"
                onChange={(event) => setQuery(event.target.value)}
              />
              <button className="button">
                {mode === "talent" ? "Find talent" : "Find jobs"}
                <ArrowRight size={17} />
              </button>
            </form>
          </div>
          <div className="hero-trust">
            <span>
              <Check size={15} />
              Hire directly
            </span>
            <span>
              <Check size={15} />
              Transparent salaries
            </span>
            <span>
              <Check size={15} />
              Always free for job seekers
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="visual-caption">
            <Sparkles size={16} /> Your next great teammate
          </div>
          <div className="hero-candidate">
            <div className="hero-candidate-cover">
              <span>OPEN TO OPPORTUNITIES</span>
              <span className="cover-pattern" />
            </div>
            <div className="hero-candidate-body">
              <Avatar name="Maria Alvarez" tone="coral" large />
              <Badge>
                <BadgeCheck size={13} />
                ID verified
              </Badge>
              <h2>Maria Alvarez</h2>
              <p>Executive Assistant & Operations</p>
              <div className="hero-talent-facts">
                <div>
                  <small>EXPERIENCE</small>
                  <strong>6 years</strong>
                </div>
                <div>
                  <small>AVAILABILITY</small>
                  <strong>Full-time</strong>
                </div>
                <div>
                  <small>LOCATION</small>
                  <strong>Philippines</strong>
                </div>
              </div>
              <div className="tags">
                <span>Notion</span>
                <span>HubSpot</span>
                <span>Executive support</span>
              </div>
              <Link className="button full secondary" href={ROUTES.talent}>
                Meet Maria <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="floating-match">
            <span className="match-icon">
              <BadgeCheck size={21} />
            </span>
            <div>
              <strong>Skills meet opportunity.</strong>
              <small>Clear profiles. Confident decisions.</small>
            </div>
          </div>
          <div className="floating-candidate">
            <Avatar name="Rafael Cruz" tone="gold" />
            <div>
              <strong>Rafael Cruz</strong>
              <small>WordPress Developer</small>
            </div>
            <span className="pulse-dot" />
          </div>
          <span className="visual-bottom">
            Designed for long-term relationships.
          </span>
        </div>
      </section>
      <div className="value-strip container">
        <div>
          <ShieldCheck />
          <span>
            <strong>Confidence comes first</strong>
            <small>Verification signals you can understand</small>
          </span>
        </div>
        <div>
          <Wallet />
          <span>
            <strong>Your pay, your agreement</strong>
            <small>Connect directly with your future team</small>
          </span>
        </div>
        <div>
          <GlobeIcon />
          <span>
            <strong>A better way to work</strong>
            <small>Full-time, part-time, or project-based</small>
          </span>
        </div>
      </div>
      <section className="section container">
        <SectionHeading
          title="Find expertise for every part of your business."
          text="More than virtual assistants. Discover specialists who move your work forward."
          action={
            <Link className="text-link" href={ROUTES.talent}>
              Explore all talent <ArrowRight size={16} />
            </Link>
          }
        />
        <div className="category-grid">
          {jobCategories.map((category, index) => {
            const Icon = categoryIcons[index];
            return (
              <Link
                className="category-card"
                key={category.name}
                href={`/jobs?q=${encodeURIComponent(category.query)}`}
              >
                <span className={`category-icon category-tone-${index % 4}`}>
                  <Icon size={21} />
                </span>
                <h3>{category.name}</h3>
                <p>{category.count}</p>
                <ArrowRight size={16} />
              </Link>
            );
          })}
        </div>
      </section>
      <section className="section jobs-showcase">
        <div className="container">
          <SectionHeading
            title="Your next chapter starts here."
            text="Discover remote roles with the details that matter, right from the start."
            action={
              <Link className="text-link" href={ROUTES.jobs}>
                Browse all jobs <ArrowRight size={16} />
              </Link>
            }
          />
          <div className="job-grid">
            {jobs.slice(0, 3).map((job) => (
              <JobCard key={job.id} job={job} compact />
            ))}
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="home-how">
          <div>
            <span className="eyebrow">A SIMPLE PATH TO A GREAT FIT</span>
            <h2>
              Search. Connect.
              <br />
              <em>Grow together.</em>
            </h2>
            <p>
              Start with a clear role, get to know the person behind the
              profile, and build a working relationship on your terms.
            </p>
            <Link className="text-link" href={ROUTES.howItWorks}>
              See how it works <ArrowRight size={16} />
            </Link>
          </div>
          <div className="home-steps">
            {[
              {
                title: "Find your fit",
                text: "Search by skill, experience, expected pay, and availability.",
              },
              {
                title: "Have a real conversation",
                text: "Compare work samples and discuss responsibilities, hours, and goals.",
              },
              {
                title: "Build your next chapter",
                text: "Agree on the details and welcome your new teammate.",
              },
            ].map((step, index) => (
              <div key={step.title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="container">
        <div className="cta-banner">
          <div>
            <span className="eyebrow">
              THE RIGHT CONNECTION CHANGES EVERYTHING
            </span>
            <h2>Let’s find your next great fit.</h2>
            <p>For the team you’re building. For the career you want.</p>
          </div>
          <div>
            <Link className="button white" href={ROUTES.talent}>
              Hire Filipino talent <ArrowRight size={16} />
            </Link>
            <Link className="button ghost-light" href={ROUTES.jobs}>
              Find remote work <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function GlobeIcon() {
  return <Users />;
}
