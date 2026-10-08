"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Coins,
  FileText,
  Plus,
  Users,
} from "lucide-react";
import { candidates, demoJobSeeker, jobs } from "@/data/fixtures";
import { ROUTES } from "@/config/product";
import type {
  Application,
  MarketplaceState,
  PipelineStage,
} from "@/domain/types";
import type { DemoStateUpdater } from "@/state/use-demo-state";
import { setApplicationStage } from "@/lib/employer-organization";
import { CandidateOrganizationControls } from "@/components/shared/candidate-organization";
import { EmployerJobQuery } from "@/components/shared/employer-job-query";
import {
  AppLayout,
  Avatar,
  Badge,
  Location,
  Metric,
  Notice,
  PageHeading,
  PortfolioTiles,
  SkillTags,
} from "@/components/shared";

export function Pipeline({
  state,
  setState,
}: {
  state: MarketplaceState;
  setState: DemoStateUpdater;
}) {
  const stages: PipelineStage[] = ["New", "Shortlisted", "Interview", "Offer"];
  const [notice, setNotice] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("all");
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);

  const selectJob = (jobId: string) => {
    setSelectedJobId(jobId);
    setSelectedApplicationId(null);
    setNotice("");
    const url = new URL(window.location.href);
    if (jobId === "all") url.searchParams.delete("job");
    else url.searchParams.set("job", jobId);
    // Preserve the GitHub Pages base path and any unrelated query parameters.
    window.history.replaceState(window.history.state, "", url);
  };
  const selectedJob = jobs.find((job) => job.id === selectedJobId);
  const applications = state.applications.filter(
    (application) =>
      selectedJobId === "all" || application.jobId === selectedJobId,
  );
  const jobOptions = jobs.filter(
    (job) =>
      job.id === selectedJobId ||
      state.applications.some((application) => application.jobId === job.id),
  );
  const candidateFor = (application: Application) =>
    application.candidateId === demoJobSeeker.id
      ? {
          ...demoJobSeeker,
          role: state.profile.headline,
          bio: state.profile.bio,
          skills: state.profile.skills,
          verified: state.profile.verified,
        }
      : candidates.find((item) => item.id === application.candidateId);
  const latestSubmission = [...state.jobApplications].sort((left, right) =>
    right.submittedAt.localeCompare(left.submittedAt),
  )[0];
  const selectedApplication =
    applications.find(
      (application) => application.id === selectedApplicationId,
    ) ??
    applications.find(
      (application) =>
        application.candidateId === demoJobSeeker.id &&
        application.jobId === latestSubmission?.jobId,
    ) ??
    applications[0];
  const selectedCandidate = selectedApplication
    ? candidateFor(selectedApplication)
    : undefined;
  const selectedIntroduction =
    selectedApplication?.candidateId === demoJobSeeker.id
      ? state.jobApplications.find(
          (application) => application.jobId === selectedApplication.jobId,
        )
      : undefined;
  const move = (id: string, stage: PipelineStage) => {
    const application = state.applications.find((item) => item.id === id);
    if (!application) return;
    setState((previous) => setApplicationStage(previous, id, stage));
    setNotice(
      `${candidateFor(application)?.name ?? "Applicant"} moved to ${stage.toLowerCase()} for ${application.jobTitle} only. Favorites and tags are unchanged.`,
    );
  };
  return (
    <AppLayout>
      <EmployerJobQuery defaultJobId="all" onJobChange={setSelectedJobId} />
      <PageHeading
        eyebrow="NORTHSTAR COMMERCE / RECRUITING"
        title="A clear path to your next hire."
        text="Review applications by job. Shortlisting belongs to a specific application; favorites and tags organize talent across your company."
        action={
          <Link className="button" href={ROUTES.talent}>
            <Users size={17} />
            Find candidates
          </Link>
        }
      />
      <div className="metrics-grid">
        <Metric
          label="Applications in view"
          value={applications.length}
          change={selectedJob?.title ?? "Across all jobs"}
        />
        <Metric
          label="Interviews scheduled"
          value={
            applications.filter(
              (application) => application.stage === "Interview",
            ).length
          }
          change="Applicants at the interview stage"
        />
        <Metric
          label="Offers in progress"
          value={
            applications.filter((application) => application.stage === "Offer")
              .length
          }
          change="Applicants at the offer stage"
        />
      </div>
      {notice && <Notice>{notice}</Notice>}
      <div className="pipeline-toolbar">
        <div>
          <span className="company-mark">NC</span>
          <span>
            <strong>Northstar hiring pipeline</strong>
            <small>
              {selectedJobId === "all"
                ? "All job applications · each shortlist is job-specific"
                : `${selectedJob?.title ?? "Selected job"} · job-specific applications`}
            </small>
          </span>
        </div>
        <div className="employer-job-filter">
          <label htmlFor="pipeline-job-filter">Review a job</label>
          <select
            id="pipeline-job-filter"
            value={selectedJobId}
            onChange={(event) => selectJob(event.target.value)}
          >
            <option value="all">All jobs ({state.applications.length})</option>
            {jobOptions.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} (
                {
                  state.applications.filter(
                    (application) => application.jobId === job.id,
                  ).length
                }
                )
              </option>
            ))}
            {selectedJobId !== "all" && !selectedJob && (
              <option value={selectedJobId}>Selected job</option>
            )}
          </select>
        </div>
      </div>
      <p className="apply-points-explainer">
        <Coins size={16} />
        Points chosen by the applicant to show interest; review skills and
        experience separately.
      </p>
      {applications.length === 0 && (
        <section className="card organization-empty-state">
          <h2>Ready for the first application.</h2>
          <p>
            {selectedJob
              ? `${selectedJob.title} does not have an application to review yet.`
              : "There are no applications for this selection yet."}{" "}
            Browse talent to build your favorites list, or review applications
            from another job. A favorite is not automatically shortlisted.
          </p>
          <div className="form-actions">
            <button
              className="button secondary"
              onClick={() => selectJob("all")}
            >
              Review all jobs
            </button>
            <Link className="button" href={ROUTES.talent}>
              Find candidates <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      )}
      {applications.length > 0 && (
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
                  const candidate = candidateFor(application);
                  if (!candidate) return null;
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
                      <span className="application-points">
                        <Badge tone="neutral">
                          <Coins size={13} />
                          {application.applyPoints} AP
                        </Badge>
                      </span>
                      <SkillTags skills={candidate.skills.slice(0, 2)} />
                      <p>
                        <Clock3 size={13} />
                        Updated today
                      </p>
                      <a
                        className="application-review-link"
                        href="#application-detail"
                        onClick={() => setSelectedApplicationId(application.id)}
                      >
                        Review application <FileText size={14} />
                      </a>
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
                  href={
                    stage === "New" ? ROUTES.talent : ROUTES.employerMessages
                  }
                >
                  <Plus size={14} />
                  {stage === "New" ? "Find a candidate" : "Open conversations"}
                </Link>
              </div>
            </section>
          ))}
        </div>
      )}
      {selectedApplication && selectedCandidate && (
        <section
          className="pipeline-application-detail card"
          id="application-detail"
          aria-labelledby="application-detail-title"
        >
          <div className="application-detail-heading">
            <div>
              <span className="eyebrow">
                APPLICATION DETAILS · JOB SPECIFIC
              </span>
              <h2 id="application-detail-title">{selectedCandidate.name}</h2>
              <p>{selectedApplication.jobTitle}</p>
            </div>
            <Badge tone="neutral">
              <Coins size={15} />
              {selectedApplication.applyPoints} Apply Points
            </Badge>
          </div>
          <p className="apply-points-explainer">
            Points chosen by the applicant to show interest; review skills and
            experience separately.
          </p>
          <section
            className="application-stage-controls"
            aria-label="Stage for this application"
          >
            <div>
              <label htmlFor="selected-application-stage">
                Stage for {selectedApplication.jobTitle}
              </label>
              <select
                id="selected-application-stage"
                value={selectedApplication.stage}
                onChange={(event) =>
                  move(
                    selectedApplication.id,
                    event.target.value as PipelineStage,
                  )
                }
              >
                {stages.map((stage) => (
                  <option key={stage}>{stage}</option>
                ))}
              </select>
            </div>
            <button
              className="button secondary"
              onClick={() =>
                move(
                  selectedApplication.id,
                  selectedApplication.stage === "Shortlisted"
                    ? "New"
                    : "Shortlisted",
                )
              }
            >
              {selectedApplication.stage === "Shortlisted"
                ? "Remove from this job’s shortlist"
                : "Shortlist for this job"}
            </button>
            <p>
              Changes apply only to {selectedCandidate.name}’s application for{" "}
              {selectedApplication.jobTitle}. Other job applications are
              unchanged.
            </p>
          </section>
          <CandidateOrganizationControls
            key={selectedCandidate.id}
            candidateId={selectedCandidate.id}
            candidateName={selectedCandidate.name}
            state={state}
            setState={setState}
          />
          {selectedIntroduction && (
            <section className="application-introduction">
              <span className="eyebrow">APPLICANT INTRODUCTION</span>
              <h3>{selectedIntroduction.subject}</h3>
              <time dateTime={selectedIntroduction.submittedAt}>
                Submitted{" "}
                {new Date(selectedIntroduction.submittedAt).toLocaleDateString(
                  "en-US",
                  { month: "long", day: "numeric", year: "numeric" },
                )}
              </time>
              <p className="application-introduction-message">
                {selectedIntroduction.message}
              </p>
            </section>
          )}
          <div className="application-detail-body">
            <div>
              <Location>{selectedCandidate.location}</Location>
              <h3>{selectedCandidate.role}</h3>
              <p>{selectedCandidate.bio}</p>
              <SkillTags skills={selectedCandidate.skills} />
            </div>
            <div className="candidate-detail-stats">
              <div>
                <small>EXPERIENCE</small>
                <strong>{selectedCandidate.experience}</strong>
              </div>
              <div>
                <small>AVAILABILITY</small>
                <strong>{selectedCandidate.availability}</strong>
              </div>
              <div>
                <small>DESIRED PAY</small>
                <strong>{selectedCandidate.desiredPay}</strong>
              </div>
              <div>
                <small>APPLICATION STAGE</small>
                <strong>{selectedApplication.stage}</strong>
              </div>
            </div>
          </div>
          <h3>Selected work</h3>
          <PortfolioTiles items={selectedCandidate.portfolio ?? []} />
          <div className="form-actions">
            <Badge tone={selectedCandidate.verified ? "green" : "neutral"}>
              {selectedCandidate.verified
                ? "Identity verified"
                : "Email confirmed"}
            </Badge>
            <Link className="button" href={ROUTES.employerMessages}>
              Open conversations <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      )}
    </AppLayout>
  );
}

export function JobManagement({ state }: { state: MarketplaceState }) {
  const [status, setStatus] = useState("All roles");
  const roleStates = ["Active", "Active", "Draft", "Closed"];
  const managedJobs = jobs.slice(0, 4);
  const managedApplications = state.applications.filter((application) =>
    managedJobs.some((job) => job.id === application.jobId),
  );
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
          value={managedApplications.length}
          change="Across the job posts below"
          icon={<FileText size={18} />}
        />
        <Metric
          label="At interview stage"
          value={
            managedApplications.filter(
              (application) => application.stage === "Interview",
            ).length
          }
          change="Applications ready for a conversation"
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
                  <strong>
                    {
                      state.applications.filter(
                        (application) => application.jobId === job.id,
                      ).length
                    }
                  </strong>
                </div>
                <div>
                  <small>POSTED</small>
                  <strong>Oct {5 - index}, 2026</strong>
                </div>
                <div className="managed-job-actions">
                  <Link className="button secondary" href={ROUTES.postJob}>
                    Edit brief
                  </Link>
                  <Link
                    className="button secondary"
                    href={`${ROUTES.shortlist}?job=${job.id}`}
                  >
                    View shortlist
                  </Link>
                  <Link
                    className="button"
                    href={`${ROUTES.pipeline}?job=${job.id}`}
                  >
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
