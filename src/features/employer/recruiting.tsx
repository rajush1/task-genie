"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  FileText,
  Plus,
  Users,
} from "lucide-react";
import { candidates, initialApplications, jobs } from "@/data/fixtures";
import { ROUTES } from "@/config/product";
import type { MarketplaceState, PipelineStage } from "@/domain/types";
import type { DemoStateUpdater } from "@/state/use-demo-state";
import {
  AppLayout,
  Avatar,
  Badge,
  Metric,
  Notice,
  PageHeading,
  SkillTags,
} from "@/components/shared";

export function Pipeline({
  state,
  setState,
}: {
  state: MarketplaceState;
  setState: DemoStateUpdater;
}) {
  const applications = state.applications.length
    ? state.applications
    : initialApplications;
  const stages: PipelineStage[] = ["New", "Shortlisted", "Interview", "Offer"];
  const [notice, setNotice] = useState("");
  const move = (id: string, stage: PipelineStage) => {
    setState((previous) => ({
      ...previous,
      applications: applications.map((application) =>
        application.id === id ? { ...application, stage } : application,
      ),
    }));
    setNotice(`Candidate moved to ${stage.toLowerCase()}.`);
  };
  return (
    <AppLayout>
      <PageHeading
        eyebrow="NORTHSTAR COMMERCE / RECRUITING"
        title="A clear path to your next hire."
        text="Keep candidates, conversations, and decisions moving together."
        action={
          <Link className="button" href={ROUTES.talent}>
            <Users size={17} />
            Find candidates
          </Link>
        }
      />
      <div className="metrics-grid">
        <Metric
          label="Active candidates"
          value={applications.length}
          change="Across remote specialist roles"
        />
        <Metric
          label="Interviews scheduled"
          value={
            applications.filter(
              (application) => application.stage === "Interview",
            ).length
          }
          change="Next: Thursday at 9:00 AM ET"
        />
        <Metric
          label="Offers in progress"
          value={
            applications.filter((application) => application.stage === "Offer")
              .length
          }
          change="Follow up on compensation details"
        />
      </div>
      {notice && <Notice>{notice}</Notice>}
      <div className="pipeline-toolbar">
        <div>
          <span className="company-mark">NC</span>
          <span>
            <strong>Northstar hiring pipeline</strong>
            <small>Operations, e-commerce & specialist hiring</small>
          </span>
        </div>
        <Badge tone="neutral">Updated today</Badge>
      </div>
      <div className="pipeline-board">
        {stages.map((stage) => (
          <section className="pipeline-column" key={stage}>
            <header>
              <h2>{stage}</h2>
              <span>
                {
                  applications.filter(
                    (application) => application.stage === stage,
                  ).length
                }
              </span>
            </header>
            {applications
              .filter((application) => application.stage === stage)
              .map((application) => {
                const candidate =
                  candidates.find(
                    (item) => item.id === application.candidateId,
                  ) ?? candidates[0];
                const next = stages[stages.indexOf(stage) + 1];
                return (
                  <article className="pipeline-card" key={application.id}>
                    <div>
                      <Avatar
                        name={candidate.name}
                        tone={candidate.avatarTone}
                      />
                      <span>
                        <strong>{candidate.name}</strong>
                        <small>{candidate.experience} experience</small>
                      </span>
                    </div>
                    <h3>{application.jobTitle}</h3>
                    <SkillTags skills={candidate.skills.slice(0, 2)} />
                    <p>
                      <Clock3 size={13} />
                      Updated today
                    </p>
                    {next ? (
                      <button onClick={() => move(application.id, next)}>
                        Move to {next}
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      <Link href={ROUTES.employerMessages}>
                        Review offer details
                        <ArrowRight size={14} />
                      </Link>
                    )}
                  </article>
                );
              })}
            <div className="pipeline-step-note">
              <span>
                {stage === "New"
                  ? "Review relevant experience"
                  : stage === "Shortlisted"
                    ? "Compare portfolios and availability"
                    : stage === "Interview"
                      ? "Prepare questions and next steps"
                      : "Confirm pay, hours, and start date"}
              </span>
              <Link
                href={stage === "New" ? ROUTES.talent : ROUTES.employerMessages}
              >
                <Plus size={14} />
                {stage === "New" ? "Find a candidate" : "Open conversations"}
              </Link>
            </div>
          </section>
        ))}
      </div>
    </AppLayout>
  );
}

export function JobManagement() {
  const [status, setStatus] = useState("All roles");
  const roleStates = ["Active", "Active", "Draft", "Closed"];
  const displayed = jobs
    .slice(0, 4)
    .filter(
      (job, index) => status === "All roles" || roleStates[index] === status,
    );
  return (
    <AppLayout>
      <PageHeading
        eyebrow="JOB MANAGEMENT"
        title="Your opportunities, organized."
        text="Review your open roles, applications, and the briefs you’re preparing."
        action={
          <Link className="button" href={ROUTES.postJob}>
            ＋ Post a job
          </Link>
        }
      />
      <div className="metrics-grid">
        <Metric
          label="Active roles"
          value="2"
          change="Recruiting for your remote team"
          icon={<BriefcaseBusiness size={18} />}
        />
        <Metric
          label="Applications received"
          value="48"
          change="8 candidates in your pipeline"
          icon={<FileText size={18} />}
        />
        <Metric
          label="Interviews this week"
          value="4"
          change="Two conversations still to schedule"
          icon={<CalendarDays size={18} />}
        />
      </div>
      <div className="results-toolbar">
        <div>
          <strong>Job posts</strong>
          <span>Published and upcoming opportunities</span>
        </div>
        <select
          aria-label="Filter job posts"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option>All roles</option>
          <option>Active</option>
          <option>Draft</option>
          <option>Closed</option>
        </select>
      </div>
      <div className="managed-jobs">
        {displayed.map((job) => {
          const index = jobs.indexOf(job);
          return (
            <article className="managed-job card" key={job.id}>
              <div className="managed-job-title">
                <span className="company-mark">NC</span>
                <div>
                  <h2>{job.title}</h2>
                  <p>
                    {job.employmentType} · {job.weeklyHours} · {job.location}
                  </p>
                </div>
                <Badge
                  tone={index < 2 ? "green" : index === 2 ? "amber" : "neutral"}
                >
                  {roleStates[index]}
                </Badge>
              </div>
              <div className="managed-job-stats">
                <div>
                  <small>COMPENSATION</small>
                  <strong>{job.salary}</strong>
                </div>
                <div>
                  <small>APPLICATIONS</small>
                  <strong>{[32, 16, 5, 21][index]}</strong>
                </div>
                <div>
                  <small>POSTED</small>
                  <strong>Oct {5 - index}, 2026</strong>
                </div>
                <div className="managed-job-actions">
                  <Link className="button secondary" href={ROUTES.postJob}>
                    Edit brief
                  </Link>
                  <Link className="button" href={ROUTES.pipeline}>
                    View applicants <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </AppLayout>
  );
}
