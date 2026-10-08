"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bookmark,
  Check,
  CheckCircle2,
  Clock3,
  Coins,
  FileText,
  Globe,
  Send,
  ShieldCheck,
} from "lucide-react";
import { jobs } from "@/data/fixtures";
import { ROUTES } from "@/config/product";
import type { MarketplaceState } from "@/domain/types";
import type { DemoStateUpdater } from "@/state/use-demo-state";
import { submitJobApplication } from "@/lib/apply-points";
import {
  Avatar,
  Badge,
  JobCard,
  SectionHeading,
  SkillTags,
  TextField,
} from "@/components/shared";

export function JobDetail({
  id,
  state,
  setState,
}: {
  id: string;
  state: MarketplaceState;
  setState: DemoStateUpdater;
}) {
  const job = jobs.find((item) => item.id === id) ?? jobs[0];
  const saved = state.savedJobIds.includes(job.id);
  const applied = state.appliedJobIds.includes(job.id);
  const [reported, setReported] = useState(false);
  return (
    <div className="container detail-page">
      <Link className="back-link" href={ROUTES.jobs}>
        <ArrowLeft size={16} />
        Back to all jobs
      </Link>
      <div className="detail-layout">
        <article className="detail-card">
          <div className="job-detail-header">
            <span className="company-mark company-large">{job.initials}</span>
            <div>
              <span className="company-name">{job.company}</span>
              <span className="verified">
                <BadgeCheck size={14} />
                {job.verified ? "Verified employer" : "Company profile"}
              </span>
            </div>
            <Badge tone="neutral">{job.employmentType}</Badge>
          </div>
          <h1>{job.title}</h1>
          <p className="detail-subtitle">
            {job.location} <span>·</span> Posted {job.posted.toLowerCase()}
          </p>
          <div className="detail-facts">
            <div>
              <small>COMPENSATION</small>
              <strong>{job.salary}</strong>
            </div>
            <div>
              <small>WEEKLY COMMITMENT</small>
              <strong>{job.weeklyHours}</strong>
            </div>
            <div>
              <small>WORKING SCHEDULE</small>
              <strong>{job.timezone}</strong>
            </div>
          </div>
          <section className="detail-section">
            <h2>About the opportunity</h2>
            {job.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
          <section className="detail-section">
            <h2>What you’ll do</h2>
            <ul className="content-list">
              {job.responsibilities?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="detail-section">
            <h2>What you’ll bring</h2>
            <ul className="content-list">
              {job.qualifications?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="detail-section">
            <h2>Skills for this role</h2>
            <SkillTags skills={job.skills} />
          </section>
          <section className="detail-section">
            <h2>What’s in it for you</h2>
            <div className="benefit-grid">
              {job.benefits?.map((benefit) => (
                <span key={benefit}>
                  <Check size={17} />
                  {benefit}
                </span>
              ))}
            </div>
          </section>
          <div className="safety-note">
            <ShieldCheck size={23} />
            <div>
              <strong>A safe application starts here.</strong>
              <p>
                Never pay to apply or share banking credentials. Review the role
                and discuss all expectations before accepting an offer.
              </p>
              <button className="link-button" onClick={() => setReported(true)}>
                {reported ? "Concern recorded" : "Report a concern"}
              </button>
            </div>
          </div>
        </article>
        <aside className="detail-sidebar">
          <div className="card apply-card">
            <span className="eyebrow">YOUR NEXT CHAPTER</span>
            <h2>This could be your next great fit.</h2>
            <p>
              Introduce yourself and show the team what you can bring to the
              role.
            </p>
            <Link
              className="button full"
              href={applied ? ROUTES.applications : `/jobs/${job.id}/apply`}
            >
              {applied ? "View your application" : "Apply for this role"}{" "}
              <ArrowRight size={17} />
            </Link>
            <Link className="points-inline-balance" href={ROUTES.applyPoints}>
              <Coins size={18} />
              <span>
                <strong>{state.applyPoints.balance} Apply Points</strong>
                <small>
                  {applied
                    ? "You’ve already applied for this role."
                    : "Choose at least 1 point when applying."}
                </small>
              </span>
              <ArrowRight size={15} />
            </Link>
            <button
              className="button secondary full"
              onClick={() =>
                setState((previous) => ({
                  ...previous,
                  savedJobIds: saved
                    ? previous.savedJobIds.filter((value) => value !== job.id)
                    : [...previous.savedJobIds, job.id],
                }))
              }
            >
              <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved to your list" : "Save for later"}
            </button>
            <p className="quiet-note">
              <ShieldCheck size={14} />
              Free to apply. Points are earned, never purchased.
            </p>
          </div>
          <div className="card company-card">
            <h3>About {job.company}</h3>
            <p>
              A remote team focused on well-organized operations, practical
              tools, and thoughtful customer experiences.
            </p>
            <div>
              <BadgeCheck size={16} />
              <span>Company information verified</span>
            </div>
            <div>
              <Clock3 size={16} />
              <span>{job.responseRate}</span>
            </div>
            <div>
              <Globe size={16} />
              <span>Distributed team · Global</span>
            </div>
            <Link className="text-link" href={ROUTES.jobs}>
              More roles from this team <ArrowRight size={14} />
            </Link>
          </div>
        </aside>
      </div>
      <div className="related-jobs">
        <SectionHeading
          title="More roles worth exploring"
          text="A few more opportunities to keep on your radar."
        />
        <div className="job-grid">
          {jobs
            .filter((item) => item.id !== job.id)
            .slice(0, 3)
            .map((item) => (
              <JobCard job={item} key={item.id} compact />
            ))}
        </div>
      </div>
    </div>
  );
}

export function ApplyPage({
  id,
  state,
  setState,
}: {
  id: string;
  state: MarketplaceState;
  setState: DemoStateUpdater;
}) {
  const job = jobs.find((item) => item.id === id) ?? jobs[0];
  const [sent, setSent] = useState(false);
  const [points, setPoints] = useState(5);
  const [error, setError] = useState("");
  const application = state.jobApplications.find(
    (item) => item.jobId === job.id,
  );
  const alreadyApplied = state.appliedJobIds.includes(job.id);
  const selectedPoints = Math.min(points, state.applyPoints.balance);
  return (
    <div className="container application-page">
      <Link className="back-link" href={ROUTES.job(job.id)}>
        <ArrowLeft size={16} />
        Back to the role
      </Link>
      {sent || alreadyApplied ? (
        <div className="confirmation card">
          <span className="success-icon">
            <CheckCircle2 size={34} />
          </span>
          <Badge>{sent ? "APPLICATION SENT" : "ALREADY APPLIED"}</Badge>
          <h1>You’ve taken the next step.</h1>
          <p>
            Your application for <strong>{job.title}</strong> is ready for{" "}
            {job.company} to review. Keep an eye on your messages for the next
            conversation.
          </p>
          <div className="confirmation-summary">
            <span className="company-mark">{job.initials}</span>
            <div>
              <strong>{job.company}</strong>
              <small>
                {job.employmentType} · {job.salary}
              </small>
            </div>
            <Badge>
              {application ? `${application.pointsUsed} AP used` : "Submitted"}
            </Badge>
          </div>
          <p className="points-receipt">
            <Coins size={18} />
            {application ? `${application.pointsUsed} points used · ` : ""}
            {state.applyPoints.balance} AP remaining. This role won’t charge you
            twice.
          </p>
          {application && (
            <details className="application-sent-copy">
              <summary>Review your introduction</summary>
              <strong>{application.subject}</strong>
              <p>{application.message}</p>
            </details>
          )}
          <div className="button-row">
            <Link className="button" href={ROUTES.applications}>
              View applications <ArrowRight size={16} />
            </Link>
            <Link className="button secondary" href={ROUTES.jobs}>
              Explore more roles
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="application-heading">
            <span className="eyebrow">MAKE A GREAT FIRST IMPRESSION</span>
            <h1>Apply to {job.company}</h1>
            <p>
              {job.title} <span>·</span> {job.employmentType}
            </p>
          </div>
          <div className="application-layout">
            <form
              noValidate
              className="form-card"
              onSubmit={(event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                const details = {
                  subject: String(form.get("subject") ?? ""),
                  message: String(form.get("message") ?? ""),
                };
                setState((previous) => {
                  const latest = submitJobApplication(
                    previous,
                    job,
                    selectedPoints,
                    details,
                  );
                  if (!latest.ok) {
                    setError(latest.message);
                    return previous;
                  }
                  setError("");
                  setSent(true);
                  return latest.state;
                });
              }}
            >
              <div className="form-section-heading">
                <h2>Your introduction</h2>
                <p>
                  Share your relevant experience and why this opportunity
                  interests you.
                </p>
              </div>
              <TextField
                label="Subject"
                name="subject"
                defaultValue={`Application: ${job.title} — Ana Mendoza`}
              />
              <label className="field-label">
                Message
                <textarea
                  name="message"
                  placeholder="Introduce yourself and share the experience you would bring to the team."
                  defaultValue={`Hi ${job.company} team,\n\nI am interested in the ${job.title} opportunity. I have five years of experience supporting remote teams with executive scheduling, customer operations, and clear process documentation.\n\nIn my most recent role, I introduced a support playbook that reduced our first-response time from 8 hours to 2 hours. I am comfortable with ${job.skills.slice(0, 2).join(" and ")} and would welcome a conversation about your team's priorities.\n\nMy portfolio includes an operations dashboard and a workflow checklist. I can start on October 19 and am comfortable with the working schedule listed.\n\nBest,\nAna Mendoza`}
                />
              </label>
              <div className="form-grid">
                <TextField
                  label="Portfolio or relevant work"
                  defaultValue="https://anamendoza.com/portfolio"
                />
                <TextField
                  label="Available to start"
                  defaultValue="October 19, 2026"
                />
              </div>
              <div className="attachment-row">
                <FileText size={24} />
                <div>
                  <strong>Ana-Mendoza-Resume.pdf</strong>
                  <small>Resume attached from your profile · 245 KB</small>
                </div>
                <CheckCircle2 size={19} />
              </div>
              <label className="check-row">
                <input type="checkbox" defaultChecked />
                Include my Task Genie profile and portfolio with this
                application.
              </label>
              <section
                className="points-picker"
                aria-labelledby="points-picker-heading"
              >
                <div className="points-picker-heading">
                  <span className="points-symbol">
                    <Coins size={23} />
                  </span>
                  <div>
                    <h2 id="points-picker-heading">
                      Show your interest with Apply Points
                    </h2>
                    <p>
                      Employers see the points you choose. More points signal
                      interest, not a stronger qualification.
                    </p>
                  </div>
                </div>
                <div className="points-picker-control">
                  <label className="field-label">
                    Points to use
                    <select
                      name="applyPoints"
                      value={selectedPoints}
                      disabled={
                        !state.profile.verified || !state.applyPoints.balance
                      }
                      onChange={(event) =>
                        setPoints(Number(event.target.value))
                      }
                    >
                      {state.applyPoints.balance ? (
                        Array.from(
                          { length: state.applyPoints.balance },
                          (_, index) => index + 1,
                        ).map((amount) => (
                          <option value={amount} key={amount}>
                            {amount} AP
                          </option>
                        ))
                      ) : (
                        <option value={0}>0 AP available</option>
                      )}
                    </select>
                  </label>
                  <div
                    className="points-quick-picks"
                    aria-label="Quick point choices"
                  >
                    {[1, 5, 10, 20]
                      .filter((amount) => amount <= state.applyPoints.balance)
                      .map((amount) => (
                        <button
                          type="button"
                          key={amount}
                          aria-pressed={selectedPoints === amount}
                          onClick={() => setPoints(amount)}
                        >
                          {amount} AP
                        </button>
                      ))}
                  </div>
                </div>
                <div className="points-spending-summary">
                  <span>
                    Available <strong>{state.applyPoints.balance} AP</strong>
                  </span>
                  <ArrowRight size={16} />
                  <span>
                    After applying{" "}
                    <strong>
                      {state.applyPoints.balance - selectedPoints} AP
                    </strong>
                  </span>
                </div>
                {!state.profile.verified ? (
                  <p className="points-attention">
                    Verify your account before earning points or applying.{" "}
                    <Link href={ROUTES.verification}>
                      Complete prototype verification
                    </Link>
                    .
                  </p>
                ) : state.applyPoints.balance === 0 ? (
                  <p className="points-attention">
                    You’ve used your points. Return on a new day for up to 10
                    free AP.{" "}
                    <Link href={ROUTES.applyPoints}>View points activity</Link>.
                  </p>
                ) : (
                  <p className="points-picker-note">
                    At least 1 AP per application. Points are deducted on
                    submission and aren’t refunded if you’re not selected.{" "}
                    <Link href={ROUTES.applyPoints}>How points work</Link>
                  </p>
                )}
              </section>
              {error && (
                <p className="points-attention" role="alert">
                  {error}
                </p>
              )}
              <div className="form-actions">
                <span className="quiet-note">
                  Preview only. No real application is sent.
                </span>
                <button
                  className="button"
                  disabled={!state.profile.verified || selectedPoints < 1}
                >
                  Send application · {selectedPoints} AP <Send size={16} />
                </button>
              </div>
            </form>
            <aside className="card application-preview">
              <Avatar name="Ana Mendoza" tone="coral" large />
              <h3>Ana Mendoza</h3>
              <p>{state.profile.headline}</p>
              <Badge tone={state.profile.verified ? "green" : "neutral"}>
                <BadgeCheck size={14} />
                {state.profile.verified
                  ? "Verified profile"
                  : "Verification needed"}
              </Badge>
              <dl>
                <div>
                  <dt>Experience</dt>
                  <dd>5 years</dd>
                </div>
                <div>
                  <dt>Availability</dt>
                  <dd>40 hours / week</dd>
                </div>
                <div>
                  <dt>English</dt>
                  <dd>C1 · Advanced</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>Toronto, Canada</dd>
                </div>
              </dl>
              <Link className="text-link" href={ROUTES.profile}>
                View your profile <ArrowRight size={14} />
              </Link>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
