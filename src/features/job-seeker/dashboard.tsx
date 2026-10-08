"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  Eye,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import type { MarketplaceState } from "@/domain/types";
import { jobs } from "@/data/fixtures";
import { ROUTES } from "@/config/product";
import {
  AppLayout,
  Avatar,
  Badge,
  JobCard,
  Metric,
  PageHeading,
  SectionHeading,
} from "@/components/shared";

export function Dashboard({ state }: { state: MarketplaceState }) {
  return (
    <AppLayout>
      <PageHeading
        eyebrow="YOUR WORKSPACE"
        title="Good morning, Ana."
        text="A new day. A few good opportunities. Let’s make your next move."
        action={
          <Link className="button" href={ROUTES.jobs}>
            Explore jobs <ArrowRight size={16} />
          </Link>
        }
      />
      <div className="metrics-grid">
        <Metric
          label="Profile views"
          value="128"
          change="↑ 18% compared with last week"
          icon={<Eye size={18} />}
        />
        <Metric
          label="Applications"
          value={state.appliedJobIds.length}
          change="2 employers are reviewing"
          icon={<BriefcaseBusiness size={18} />}
        />
        <Metric
          label="Conversations"
          value="3"
          change="2 new messages to read"
          icon={<MessageSquare size={18} />}
        />
      </div>
      <div className="dashboard-feature-grid">
        <section className="profile-overview card">
          <div className="profile-overview-top">
            <Avatar name="Ana Mendoza" tone="coral" large />
            <div>
              <h2>Your profile is ready to shine.</h2>
              <p>Executive Virtual Assistant · Toronto, Canada</p>
            </div>
            <Badge>
              <BadgeCheck size={14} />
              Verified
            </Badge>
          </div>
          <div className="completion-line">
            <strong>Profile strength</strong>
            <span>100% complete</span>
          </div>
          <div className="meter">
            <span style={{ width: "100%" }} />
          </div>
          <div className="completion-list">
            <span>
              <Check size={14} />
              Resume
            </span>
            <span>
              <Check size={14} />
              Portfolio
            </span>
            <span>
              <Check size={14} />
              Skills
            </span>
            <span>
              <Check size={14} />
              Verification
            </span>
          </div>
          <Link className="text-link" href={ROUTES.profile}>
            Review your profile <ArrowRight size={15} />
          </Link>
        </section>
        <section className="next-step-card">
          <span className="eyebrow">
            <Sparkles size={14} />
            UP NEXT
          </span>
          <h2>A conversation worth preparing for.</h2>
          <p>Emma at Northstar Commerce would like to meet you.</p>
          <div>
            <span className="company-mark">NC</span>
            <span>
              <strong>Executive Assistant</strong>
              <small>Thursday · 9:00 AM Eastern</small>
            </span>
          </div>
          <Link className="button full secondary" href={ROUTES.messages}>
            Open conversation <ArrowRight size={15} />
          </Link>
        </section>
      </div>
      <SectionHeading
        title="Roles that fit your experience"
        text="A few opportunities aligned with your operations and e-commerce skills."
        action={
          <Link className="text-link" href={ROUTES.jobs}>
            View all jobs <ArrowRight size={15} />
          </Link>
        }
      />
      <div className="job-grid">
        {jobs.slice(0, 3).map((job) => (
          <JobCard key={job.id} job={job} compact />
        ))}
      </div>
      <div className="dashboard-activity">
        <SectionHeading
          title="Your search is moving forward"
          action={
            <Link className="text-link" href={ROUTES.applications}>
              All applications <ArrowRight size={15} />
            </Link>
          }
        />
        <div className="card activity-timeline">
          {[
            {
              title: "Northstar Commerce invited you to meet",
              text: "Executive Assistant · New message",
              time: "42 min ago",
              icon: MessageSquare,
            },
            {
              title: "Loop Studios viewed your application",
              text: "Content Operations Specialist · In review",
              time: "2 hours ago",
              icon: Eye,
            },
            {
              title: "Your profile verification is complete",
              text: "Identity verified · Badge added to your profile",
              time: "Yesterday",
              icon: BadgeCheck,
            },
          ].map(({ title, text, time, icon: Icon }) => (
            <div key={title}>
              <span className="timeline-icon">
                <Icon size={17} />
              </span>
              <span>
                <strong>{title}</strong>
                <small>{text}</small>
              </span>
              <time>{time}</time>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
