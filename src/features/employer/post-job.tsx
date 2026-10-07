"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { ROUTES } from "@/config/product";
import {
  AppLayout,
  Badge,
  cx,
  PageHeading,
  SkillTags,
  TextField,
} from "@/components/shared";

interface JobDraft {
  title: string;
  category: string;
  type: string;
  hours: string;
  salaryMin: string;
  salaryMax: string;
  currency: string;
  timezone: string;
  summary: string;
  skills: string;
  english: string;
  experience: string;
  workSample: string;
}
const initialDraft: JobDraft = {
  title: "Executive Assistant to Founder",
  category: "Virtual assistance & operations",
  type: "Full-time",
  hours: "40",
  salaryMin: "1000",
  salaryMax: "1400",
  currency: "USD",
  timezone: "4 hours with US Eastern",
  summary:
    "We are looking for an organized Executive Assistant to support our founder and remote e-commerce team. You will coordinate calendars across time zones, maintain Notion project boards, manage follow-ups, and keep our HubSpot records accurate. We value clear written communication, reliable follow-through, and the ability to spot small improvements in everyday workflows.",
  skills: "Executive support, Notion, HubSpot, Google Workspace",
  english: "C1 · Advanced",
  experience: "2–5 years supporting a founder or remote team",
  workSample:
    "Please share an operations checklist, a calendar coordination example, or a short overview of a workflow you improved.",
};

export function PostJob() {
  const [step, setStep] = useState(1);
  const [posted, setPosted] = useState(false);
  const [draft, setDraft] = useState(initialDraft);
  const field =
    (key: keyof JobDraft) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setDraft((previous) => ({ ...previous, [key]: event.target.value }));
  if (posted)
    return (
      <AppLayout>
        <div className="confirmation card">
          <span className="success-icon">
            <CheckCircle2 size={34} />
          </span>
          <Badge>ROLE READY</Badge>
          <h1>Your next hire starts here.</h1>
          <p>
            <strong>{draft.title || initialDraft.title}</strong> is now ready
            for candidates to discover. Review applicants and keep your hiring
            process organized.
          </p>
          <div className="confirmation-summary">
            <span className="company-mark">NC</span>
            <div>
              <strong>Northstar Commerce</strong>
              <small>
                {draft.type} · {draft.hours} hrs/week · {draft.currency}{" "}
                {draft.salaryMin}–{draft.salaryMax}
              </small>
            </div>
            <Badge>Active</Badge>
          </div>
          <div className="button-row">
            <Link className="button" href={ROUTES.employerJobs}>
              Manage job posts <ArrowRight size={16} />
            </Link>
            <button
              className="button secondary"
              onClick={() => {
                setPosted(false);
                setStep(1);
              }}
            >
              Edit this role
            </button>
          </div>
        </div>
      </AppLayout>
    );
  return (
    <AppLayout>
      <PageHeading
        eyebrow="JOB POSTS / CREATE A ROLE"
        title="Great hires start with a clear brief."
        text="Give candidates the details they need to see how they can contribute."
        action={
          <Badge>
            <Check size={13} />
            Draft ready
          </Badge>
        }
      />
      <ol className="stepper">
        {["The role", "Working details", "Skills & fit", "Review"].map(
          (label, index) => (
            <li
              className={cx(
                step >= index + 1 && "active",
                step === index + 1 && "current",
              )}
              key={label}
            >
              <button onClick={() => setStep(index + 1)}>
                <span>
                  {step > index + 1 ? <Check size={14} /> : index + 1}
                </span>
                <strong>{label}</strong>
              </button>
            </li>
          ),
        )}
      </ol>
      <div className="wizard-layout">
        <form
          noValidate
          className="form-card"
          onSubmit={(event) => {
            event.preventDefault();
            if (step === 4) setPosted(true);
            else setStep(step + 1);
          }}
        >
          <div className="form-section-heading">
            <span className="eyebrow">STEP {step} OF 4</span>
            <h2>
              {
                [
                  "Tell us about the opportunity.",
                  "Make the expectations clear.",
                  "Focus on the skills that matter.",
                  "One last look before you post.",
                ][step - 1]
              }
            </h2>
            <p>
              {
                [
                  "A specific title and description attract more relevant candidates.",
                  "Compensation and hours are visible before someone applies.",
                  "Include the tools and experience your team will use every day.",
                  "Your complete job brief is ready to share.",
                ][step - 1]
              }
            </p>
          </div>
          {step === 1 && (
            <>
              <TextField
                label="Job title"
                value={draft.title}
                placeholder="Executive Assistant to Founder"
                onChange={field("title")}
              />
              <label className="field-label">
                Category
                <select value={draft.category} onChange={field("category")}>
                  <option>Virtual assistance & operations</option>
                  <option>Marketing & SEO</option>
                  <option>Development & IT</option>
                  <option>Design & creative</option>
                  <option>Customer support</option>
                </select>
              </label>
              <label className="field-label">
                Job overview
                <textarea
                  value={draft.summary}
                  placeholder="Describe the role, responsibilities, and how this person will contribute."
                  onChange={field("summary")}
                />
              </label>
            </>
          )}
          {step === 2 && (
            <>
              <div className="form-grid">
                <label className="field-label">
                  Employment type
                  <select value={draft.type} onChange={field("type")}>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                  </select>
                </label>
                <TextField
                  label="Hours per week"
                  value={draft.hours}
                  placeholder="40"
                  onChange={field("hours")}
                />
              </div>
              <div className="form-grid">
                <TextField
                  label="Minimum monthly pay"
                  value={draft.salaryMin}
                  placeholder="1,000"
                  onChange={field("salaryMin")}
                />
                <TextField
                  label="Maximum monthly pay"
                  value={draft.salaryMax}
                  placeholder="1,400"
                  onChange={field("salaryMax")}
                />
              </div>
              <label className="field-label">
                Pay currency
                <select value={draft.currency} onChange={field("currency")}>
                  <option>USD</option>
                  <option>PHP</option>
                  <option>GBP</option>
                  <option>AUD</option>
                </select>
              </label>
              <TextField
                label="Working schedule / overlap"
                value={draft.timezone}
                placeholder="4 hours with US Eastern"
                onChange={field("timezone")}
              />
            </>
          )}
          {step === 3 && (
            <>
              <TextField
                label="Essential skills"
                value={draft.skills}
                placeholder="Executive support, Notion, HubSpot"
                onChange={field("skills")}
              />
              <SkillTags
                skills={draft.skills
                  .split(",")
                  .map((skill) => skill.trim())
                  .filter(Boolean)}
              />
              <label className="field-label">
                English proficiency
                <select value={draft.english} onChange={field("english")}>
                  <option>C1 · Advanced</option>
                  <option>C2 · Proficient</option>
                  <option>B2 · Upper intermediate</option>
                </select>
              </label>
              <TextField
                label="Relevant experience"
                value={draft.experience}
                placeholder="2–5 years supporting a founder or remote team"
                onChange={field("experience")}
              />
              <label className="field-label">
                Work sample to include
                <textarea
                  placeholder="Suggest a relevant portfolio or work sample."
                  value={draft.workSample}
                  onChange={field("workSample")}
                />
              </label>
            </>
          )}
          {step === 4 && (
            <div className="job-draft-preview">
              <div>
                <span className="company-mark">NC</span>
                <Badge>Verified employer</Badge>
              </div>
              <h2>{draft.title || initialDraft.title}</h2>
              <p className="muted">Northstar Commerce · Philippines, remote</p>
              <div className="detail-facts">
                <div>
                  <small>PAY RANGE</small>
                  <strong>
                    {draft.currency} {draft.salaryMin}–{draft.salaryMax}
                  </strong>
                </div>
                <div>
                  <small>COMMITMENT</small>
                  <strong>
                    {draft.type} · {draft.hours}h / week
                  </strong>
                </div>
                <div>
                  <small>SCHEDULE</small>
                  <strong>{draft.timezone}</strong>
                </div>
              </div>
              <h3>About the role</h3>
              <p>{draft.summary}</p>
              <h3>Skills & experience</h3>
              <SkillTags
                skills={draft.skills
                  .split(",")
                  .map((skill) => skill.trim())
                  .filter(Boolean)}
              />
              <p>
                {draft.english} English · {draft.experience}
              </p>
              <h3>Work sample to include</h3>
              <p>{draft.workSample}</p>
            </div>
          )}
          <div className="wizard-actions">
            {step === 1 ? (
              <Link className="button secondary" href={ROUTES.employerJobs}>
                <ArrowLeft size={16} />
                Back
              </Link>
            ) : (
              <button
                type="button"
                className="button secondary"
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft size={16} />
                Previous step
              </button>
            )}
            <button className="button">
              {step === 4 ? "Post job" : "Continue"}
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
        <aside className="wizard-guidance">
          <span className="feature-icon">
            <Sparkles size={23} />
          </span>
          <h2>A little clarity goes a long way.</h2>
          <p>
            A good job brief answers the questions a thoughtful candidate will
            ask.
          </p>
          <div>
            <Check size={17} />
            <span>
              <strong>Be specific</strong>Describe the outcomes, not just a long
              list of tasks.
            </span>
          </div>
          <div>
            <Check size={17} />
            <span>
              <strong>Be transparent</strong>Include pay, hours, and time-zone
              expectations.
            </span>
          </div>
          <div>
            <Check size={17} />
            <span>
              <strong>Be practical</strong>Choose skills the person will use in
              the first month.
            </span>
          </div>
          <span className="guidance-footnote">
            Your first conversation starts with this brief.
          </span>
        </aside>
      </div>
    </AppLayout>
  );
}
