"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  Check,
  Clock3,
  Globe,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import type { Candidate, Job } from "@/domain/types";
import { ROUTES } from "@/config/product";
import { Avatar, Badge, cx, Location, PortfolioTiles, SkillTags } from "./ui";

export function JobCard({
  job,
  saved,
  onSave,
  compact = false,
}: {
  job: Job;
  saved?: boolean;
  onSave?: (id: string) => void;
  compact?: boolean;
}) {
  return (
    <article className={cx("job-card", compact && "job-card-compact")}>
      <div className="job-card-top">
        <span
          className={cx(
            "company-mark",
            `company-${job.initials.charCodeAt(0) % 4}`,
          )}
        >
          {job.initials}
        </span>
        <div>
          <span className="company-name">{job.company}</span>
          {job.verified && (
            <span className="verified">
              <BadgeCheck size={13} /> Verified employer
            </span>
          )}
        </div>
        {onSave && (
          <button
            className={cx("icon-button bookmark-button", saved && "is-saved")}
            onClick={() => onSave(job.id)}
            aria-label={`${saved ? "Unsave" : "Save"} ${job.title}`}
            aria-pressed={saved}
          >
            <Bookmark size={19} fill={saved ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      <h3>
        <Link href={ROUTES.job(job.id)}>{job.title}</Link>
      </h3>
      <p className="job-summary">{job.summary}</p>
      <div className="job-salary">
        {job.salary}
        <Badge tone="neutral">{job.employmentType}</Badge>
      </div>
      <div className="job-meta">
        <span>
          <Clock3 size={14} />
          {job.weeklyHours}
        </span>
        <span>
          <Globe size={14} />
          {job.timezone}
        </span>
      </div>
      <SkillTags skills={job.skills} />
      <div className="job-card-bottom">
        <span>{job.posted}</span>
        <Link href={ROUTES.job(job.id)}>
          View role <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}

export function CandidateRow({
  candidate,
  selected,
  onClick,
}: {
  candidate: Candidate;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cx("candidate-row", selected && "selected")}
      onClick={onClick}
      aria-pressed={selected}
    >
      <Avatar name={candidate.name} tone={candidate.avatarTone} />
      <span className="candidate-info">
        <span className="candidate-name">
          {candidate.name}
          {candidate.verified && <BadgeCheck size={15} />}
        </span>
        <span className="candidate-role">{candidate.role}</span>
        <span className="candidate-inline">
          <span>{candidate.experience} experience</span>
          <span>{candidate.lastActive}</span>
        </span>
        <SkillTags skills={candidate.skills.slice(0, 3)} />
      </span>
      <span className="candidate-rate">
        <strong>{candidate.desiredPay}</strong>
        <span className="available-dot">
          {candidate.availability.includes("Available now")
            ? "Available now"
            : "Available in 1 week"}
        </span>
      </span>
    </button>
  );
}

export function CandidateDetail({
  candidate,
  shortlisted,
  toggle,
}: {
  candidate: Candidate;
  shortlisted: boolean;
  toggle: () => void;
}) {
  return (
    <aside className="candidate-detail card">
      <div className="candidate-detail-top">
        <Avatar name={candidate.name} tone={candidate.avatarTone} large />
        <Badge tone={candidate.verified ? "green" : "neutral"}>
          <BadgeCheck size={13} />
          {candidate.verified ? "Identity verified" : "Email confirmed"}
        </Badge>
      </div>
      <h2>{candidate.name}</h2>
      <p className="muted">{candidate.role}</p>
      <Location>{candidate.location}</Location>
      <div className="availability">
        <Check size={15} />
        {candidate.availability}
      </div>
      <div className="candidate-detail-stats">
        <div>
          <small>DESIRED PAY</small>
          <strong>{candidate.desiredPay}</strong>
        </div>
        <div>
          <small>ENGLISH</small>
          <strong>{candidate.english}</strong>
        </div>
        <div>
          <small>RESPONSE TIME</small>
          <strong>{candidate.responseTime}</strong>
        </div>
        <div>
          <small>EXPERIENCE</small>
          <strong>{candidate.experience}</strong>
        </div>
      </div>
      <h3>About {candidate.name.split(" ")[0]}</h3>
      <p className="candidate-bio">{candidate.bio}</p>
      <h3>Top skills</h3>
      <SkillTags skills={candidate.skills} />
      <h3>Selected work</h3>
      <PortfolioTiles
        items={
          candidate.portfolio ?? ["Operations playbook", "Project handoff"]
        }
      />
      <div className="candidate-actions">
        <Link className="button" href={ROUTES.employerMessages}>
          <MessageSquare size={16} />
          Message
        </Link>
        <button className="button secondary" onClick={toggle}>
          <Bookmark size={16} fill={shortlisted ? "currentColor" : "none"} />
          {shortlisted ? "Shortlisted" : "Shortlist"}
        </button>
      </div>
      <p className="privacy-note">
        <ShieldCheck size={13} />
        Contact details are shared by the candidate.
      </p>
    </aside>
  );
}
