"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  Search,
  Star,
  Users,
} from "lucide-react";
import {
  candidates,
  demoJobSeeker,
  initialApplications,
  jobs,
} from "@/data/fixtures";
import { ROUTES } from "@/config/product";
import type { MarketplaceState } from "@/domain/types";
import type { DemoStateUpdater } from "@/state/use-demo-state";
import {
  getCandidateApplications,
  setApplicationStage,
} from "@/lib/employer-organization";
import { CandidateOrganizationControls } from "@/components/shared/candidate-organization";
import { EmployerJobQuery } from "@/components/shared/employer-job-query";
import {
  AppLayout,
  Badge,
  CandidateDetail,
  CandidateRow,
  cx,
  PageHeading,
} from "@/components/shared";

const defaultShortlistJobId =
  initialApplications.find((application) => application.stage === "Shortlisted")
    ?.jobId ?? jobs[0].id;

export function EmployerTalent({
  state,
  setState,
  view = "search",
  initialQuery = "",
}: {
  state: MarketplaceState;
  setState: DemoStateUpdater;
  view?: "search" | "favorites" | "shortlist";
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [selected, setSelected] = useState(candidates[0].id);
  const [compare, setCompare] = useState(false);
  const [skill, setSkill] = useState("All skills");
  const [country, setCountry] = useState("All countries");
  const [availability, setAvailability] = useState("Any availability");
  const [verified, setVerified] = useState(false);
  const [tag, setTag] = useState("All tags");
  const [jobId, setJobId] = useState(defaultShortlistJobId);
  const selectedJob = jobs.find((job) => job.id === jobId) ?? jobs[0];
  const directory = [
    ...candidates,
    {
      ...demoJobSeeker,
      role: state.profile.headline,
      bio: state.profile.bio,
      skills: state.profile.skills,
      verified: state.profile.verified,
    },
  ];
  const shortlistedIds = new Set(
    state.applications
      .filter(
        (application) =>
          application.jobId === selectedJob?.id &&
          application.stage === "Shortlisted",
      )
      .map((application) => application.candidateId),
  );
  const pool = directory.filter((candidate) =>
    view === "favorites"
      ? state.favoritedCandidateIds.includes(candidate.id)
      : view === "shortlist"
        ? shortlistedIds.has(candidate.id)
        : true,
  );
  const employerTags = [
    ...new Set(Object.values(state.candidateTags).flat()),
  ].sort();
  const activeTag = employerTags.includes(tag) ? tag : "All tags";
  const matched = pool.filter(
    (candidate) =>
      [
        candidate.name,
        candidate.role,
        ...candidate.skills,
        ...(state.candidateTags[candidate.id] ?? []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (skill === "All skills" || candidate.skills.includes(skill)) &&
      (country === "All countries" || candidate.country === country) &&
      (activeTag === "All tags" ||
        (state.candidateTags[candidate.id] ?? []).includes(activeTag)) &&
      (!verified || candidate.verified) &&
      (availability === "Any availability" ||
        candidate.availability.includes("Available now")),
  );
  const displayed = matched;
  const candidate =
    displayed.find((item) => item.id === selected) ?? displayed[0];
  const candidateApplications = candidate
    ? getCandidateApplications(state, candidate.id).filter(
        (application) =>
          view !== "shortlist" || application.jobId === selectedJob?.id,
      )
    : [];
  return (
    <AppLayout>
      {view === "shortlist" && (
        <EmployerJobQuery
          defaultJobId={defaultShortlistJobId}
          onJobChange={setJobId}
        />
      )}
      <PageHeading
        eyebrow="NORTHSTAR COMMERCE / RECRUITING"
        title={
          view === "shortlist"
            ? "The right people for this role."
            : view === "favorites"
              ? "Great talent, kept in view."
              : "Your next great teammate is here."
        }
        text={
          view === "shortlist"
            ? "Shortlists belong to individual jobs. Only people who applied to the selected role appear here."
            : view === "favorites"
              ? "Your running list of favorite freelancers, whether or not they have applied to a job."
              : "Find professionals worldwide. Save Favorites and add your own tags without changing a job’s shortlist."
        }
        action={
          <Link className="button" href={ROUTES.postJob}>
            ＋ Post a job
          </Link>
        }
      />
      <nav className="talent-view-tabs" aria-label="Talent collections">
        <Link
          className={cx(view === "search" && "active")}
          href={ROUTES.talent}
        >
          <Search size={15} /> Talent search
        </Link>
        <Link
          className={cx(view === "favorites" && "active")}
          href={ROUTES.favorites}
        >
          <Star size={15} /> Favorites{" "}
          <span>{state.favoritedCandidateIds.length}</span>
        </Link>
        <Link
          className={cx(view === "shortlist" && "active")}
          href={ROUTES.shortlist}
        >
          <Bookmark size={15} /> Job shortlists
        </Link>
      </nav>
      {view === "shortlist" && (
        <div className="employer-job-filter">
          <label htmlFor="shortlist-job">Shortlist for job</label>
          <select
            id="shortlist-job"
            value={selectedJob?.id ?? ""}
            onChange={(event) => {
              setJobId(event.target.value);
              const url = new URL(window.location.href);
              url.searchParams.set("job", event.target.value);
              window.history.replaceState(window.history.state, "", url);
            }}
          >
            {jobs.map((job) => (
              <option value={job.id} key={job.id}>
                {job.title}
              </option>
            ))}
          </select>
          <Link href={`${ROUTES.pipeline}?job=${selectedJob?.id ?? ""}`}>
            Review this job’s applicants <ArrowRight size={15} />
          </Link>
        </div>
      )}
      <div className="talent-controls">
        <div className="input-wrap">
          <Search size={18} />
          <input
            aria-label="Search candidates"
            placeholder="e.g. Executive assistant, Shopify, or QuickBooks"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <select
          aria-label="Filter candidates by skill"
          value={skill}
          onChange={(event) => setSkill(event.target.value)}
        >
          <option>All skills</option>
          <option>Executive support</option>
          <option>Shopify</option>
          <option>QuickBooks</option>
          <option>WordPress</option>
        </select>
        <select
          aria-label="Filter candidates by country"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
        >
          <option>All countries</option>
          {[...new Set(candidates.map((candidate) => candidate.country))]
            .sort()
            .map((candidateCountry) => (
              <option key={candidateCountry}>{candidateCountry}</option>
            ))}
        </select>
        <select
          aria-label="Filter candidates by employer tag"
          value={activeTag}
          onChange={(event) => setTag(event.target.value)}
        >
          <option>All tags</option>
          {employerTags.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          aria-label="Filter availability"
          value={availability}
          onChange={(event) => setAvailability(event.target.value)}
        >
          <option>Any availability</option>
          <option>Available now</option>
        </select>
        <button
          className={cx("button secondary", verified && "is-selected")}
          onClick={() => setVerified(!verified)}
        >
          <BadgeCheck size={16} />
          Verified
        </button>
      </div>
      <div className="results-toolbar">
        <div>
          <strong>
            {displayed.length}{" "}
            {view === "shortlist"
              ? `shortlisted applicant${displayed.length === 1 ? "" : "s"}`
              : `${view === "favorites" ? "favorite" : "matching"} professional${displayed.length === 1 ? "" : "s"}`}
          </strong>
          <span>
            {view === "shortlist"
              ? selectedJob?.title
              : "Review work samples, availability, expected pay, and your tags."}
          </span>
        </div>
        <button
          className="button secondary small"
          onClick={() => setCompare(!compare)}
        >
          <Users size={16} />
          {compare ? "Hide comparison" : "Compare candidates"}
        </button>
      </div>
      {compare && displayed.length > 0 && (
        <div className="table-card comparison-table">
          <div className="table-title">
            <h2>Candidate comparison</h2>
            <Badge>Side by side</Badge>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Professional</th>
                  <th>Experience</th>
                  <th>English</th>
                  <th>Expected pay</th>
                  <th>Availability</th>
                </tr>
              </thead>
              <tbody>
                {displayed.slice(0, 3).map((item) => (
                  <tr key={item.id}>
                    <td className="strong">{item.name}</td>
                    <td>{item.experience}</td>
                    <td>{item.english}</td>
                    <td>{item.desiredPay}</td>
                    <td>{item.availability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {candidate ? (
        <div className="candidate-layout">
          <div className="candidate-list">
            {displayed.map((item) => (
              <CandidateRow
                candidate={item}
                selected={item.id === candidate.id}
                onClick={() => setSelected(item.id)}
                favorite={state.favoritedCandidateIds.includes(item.id)}
                employerTags={state.candidateTags[item.id] ?? []}
                key={item.id}
              />
            ))}
          </div>
          <CandidateDetail
            key={candidate.id}
            candidate={candidate}
            organization={
              <CandidateOrganizationControls
                candidateId={candidate.id}
                candidateName={candidate.name}
                state={state}
                setState={setState}
              />
            }
            applicationActions={
              <section
                className="candidate-job-applications"
                aria-label="Job-specific shortlisting"
              >
                <h3>Job applications</h3>
                <p className="organization-hint">
                  Shortlist only for a role this freelancer has applied to.
                  Favorites and tags stay separate.
                </p>
                {candidateApplications.length ? (
                  candidateApplications.map((application) => (
                    <div
                      className="candidate-job-application"
                      key={application.id}
                    >
                      <strong>{application.jobTitle}</strong>
                      <Badge
                        tone={
                          application.stage === "Shortlisted"
                            ? "green"
                            : "neutral"
                        }
                      >
                        {application.stage}
                      </Badge>
                      {application.stage === "New" ||
                      application.stage === "Shortlisted" ? (
                        <button
                          className="button secondary small"
                          onClick={() =>
                            setState((previous) =>
                              setApplicationStage(
                                previous,
                                application.id,
                                application.stage === "Shortlisted"
                                  ? "New"
                                  : "Shortlisted",
                              ),
                            )
                          }
                        >
                          <Bookmark
                            size={14}
                            fill={
                              application.stage === "Shortlisted"
                                ? "currentColor"
                                : "none"
                            }
                          />
                          {application.stage === "Shortlisted"
                            ? "Remove from this job’s shortlist"
                            : "Shortlist for this job"}
                        </button>
                      ) : null}
                      <Link
                        href={`${ROUTES.pipeline}?job=${application.jobId}`}
                      >
                        View job pipeline <ArrowRight size={13} />
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="organization-hint">
                    This freelancer has not applied to your jobs yet. You can
                    add them to Favorites, tag them, or start a conversation.
                  </p>
                )}
              </section>
            }
          />
        </div>
      ) : (
        <section className="talent-collection-guidance card">
          <h2>
            {pool.length
              ? "Try a broader search."
              : view === "shortlist"
                ? "Build a shortlist for this role."
                : "Keep your next great teammate close."}
          </h2>
          <p>
            {pool.length
              ? "Adjust your filters to see professionals in this collection."
              : view === "shortlist"
                ? "Review this job’s applicants and shortlist the people you’d like to consider. Favorites from other jobs won’t appear here."
                : "Browse worldwide professionals and use Add to Favorites to start your running talent list."}
          </p>
          {pool.length ? (
            <button
              className="button secondary"
              onClick={() => {
                setQuery("");
                setSkill("All skills");
                setCountry("All countries");
                setAvailability("Any availability");
                setVerified(false);
                setTag("All tags");
              }}
            >
              Clear filters
            </button>
          ) : (
            <Link
              className="button"
              href={
                view === "shortlist"
                  ? `${ROUTES.pipeline}?job=${selectedJob?.id ?? ""}`
                  : ROUTES.talent
              }
            >
              {view === "shortlist"
                ? "Review this job’s applicants"
                : "Explore talent"}{" "}
              <ArrowRight size={15} />
            </Link>
          )}
        </section>
      )}
    </AppLayout>
  );
}
