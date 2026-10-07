"use client";

import Link from "next/link";
import { ArrowRight, Bookmark, Clock3, Search } from "lucide-react";
import type { MarketplaceState } from "@/domain/types";
import type { DemoStateUpdater } from "@/state/use-demo-state";
import { jobs } from "@/data/fixtures";
import { ROUTES } from "@/config/product";
import {
  AppLayout,
  Badge,
  JobCard,
  Metric,
  PageHeading,
} from "@/components/shared";

export function SavedPage({
  state,
  setState,
}: {
  state: MarketplaceState;
  setState: DemoStateUpdater;
}) {
  const saved = jobs.filter((job) => state.savedJobIds.includes(job.id));
  const displayed = saved.length ? saved : jobs.slice(0, 4);
  return (
    <AppLayout>
      <PageHeading
        eyebrow="YOUR PERSONAL SHORTLIST"
        title="Good opportunities, kept close."
        text="Compare the roles that caught your attention and take the next step when you’re ready."
        action={
          <Link className="button secondary" href={ROUTES.jobs}>
            Find more jobs <ArrowRight size={16} />
          </Link>
        }
      />
      <div className="list-summary">
        <span>
          <Bookmark size={17} />
          {displayed.length}{" "}
          {saved.length ? "saved opportunities" : "opportunities to explore"}
        </span>
        <span>Recently added first</span>
      </div>
      <div className="saved-grid">
        {displayed.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            saved={state.savedJobIds.includes(job.id)}
            onSave={(id) =>
              setState((previous) => ({
                ...previous,
                savedJobIds: previous.savedJobIds.includes(id)
                  ? previous.savedJobIds.filter((value) => value !== id)
                  : [...previous.savedJobIds, id],
              }))
            }
          />
        ))}
      </div>
    </AppLayout>
  );
}

export function ApplicationsPage({ state }: { state: MarketplaceState }) {
  const applied = jobs.filter((job) => state.appliedJobIds.includes(job.id));
  const statuses = ["In review", "Interview", "Submitted", "Shortlisted"];
  return (
    <AppLayout>
      <PageHeading
        eyebrow="APPLICATION TRACKER"
        title="Every next step, in view."
        text="Follow your opportunities from the first introduction to the next conversation."
        action={
          <Link className="button secondary" href={ROUTES.jobs}>
            Explore more roles <ArrowRight size={16} />
          </Link>
        }
      />
      <div className="metrics-grid">
        <Metric
          label="Total applications"
          value={applied.length}
          change="Across 4 remote teams"
        />
        <Metric
          label="In progress"
          value="3"
          change="Employers reviewing your profile"
        />
        <Metric
          label="Interview invitations"
          value="1"
          change="Your next conversation is scheduled"
        />
      </div>
      <div className="table-card">
        <div className="table-title">
          <h2>My applications</h2>
          <Badge tone="neutral">October 2026</Badge>
        </div>
        <div className="application-list">
          {applied.map((job, index) => (
            <article className="application-row" key={job.id}>
              <span className="company-mark">{job.initials}</span>
              <div>
                <h3>{job.title}</h3>
                <span>{job.company}</span>
              </div>
              <span className="application-date">
                <Clock3 size={14} />
                Oct {6 - index}, 2026
              </span>
              <Badge
                tone={index === 1 ? "blue" : index === 2 ? "neutral" : "green"}
              >
                {statuses[index % 4]}
              </Badge>
              <Link
                className="icon-button"
                href={ROUTES.job(job.id)}
                aria-label={`View ${job.title}`}
              >
                <ArrowRight size={18} />
              </Link>
            </article>
          ))}
        </div>
      </div>
      <div className="notice notice-blue">
        <Search size={18} />
        <span>
          A thoughtful follow-up can help. Keep your conversations and work
          samples ready in <Link href={ROUTES.messages}>Messages</Link>.
        </span>
      </div>
    </AppLayout>
  );
}
