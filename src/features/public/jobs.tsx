"use client";

import { useState } from "react";
import {
  ArrowDownWideNarrow,
  ArrowRight,
  Bell,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { MarketplaceState } from "@/domain/types";
import type { DemoStateUpdater } from "@/state/use-demo-state";
import { jobs } from "@/data/fixtures";
import { filterJobs } from "@/lib/marketplace";
import { cx, JobCard, Notice, PageHeading } from "@/components/shared";

const postingAgeHours = (posted: string) => {
  if (posted.includes("hours")) return Number.parseInt(posted, 10);
  if (posted === "Today") return 12;
  if (posted === "Yesterday") return 36;
  return Number.parseInt(posted, 10) * 24 || 48;
};

export function JobsPage({
  state,
  setState,
  initialQuery = "",
}: {
  state: MarketplaceState;
  setState: DemoStateUpdater;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [types, setTypes] = useState<string[]>([]);
  const [verified, setVerified] = useState(false);
  const [overlap, setOverlap] = useState("Any schedule");
  const [sort, setSort] = useState("Recommended");
  const [page, setPage] = useState(1);
  const updateQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const [drawer, setDrawer] = useState(false);
  const [alert, setAlert] = useState(false);
  const matched = filterJobs(jobs, query, types, verified).filter(
    (job) =>
      overlap === "Any schedule" ||
      (overlap === "US overlap"
        ? job.timezone.includes("US")
        : job.timezone.includes("Flexible") || job.timezone.includes("Async")),
  );
  const displayed = (matched.length ? matched : jobs.slice(0, 5))
    .slice()
    .sort((a, b) =>
      sort === "Highest pay"
        ? (b.salaryUsd ?? 0) - (a.salaryUsd ?? 0)
        : sort === "Newest first"
          ? postingAgeHours(a.posted) - postingAgeHours(b.posted)
          : 0,
    );
  const totalPages = Math.max(1, Math.ceil(displayed.length / 6));
  const currentPage = Math.min(page, totalPages);
  const pageJobs = displayed.slice((currentPage - 1) * 6, currentPage * 6);
  const changePage = (value: number) => {
    setPage(value);
    document
      .querySelector(".search-results")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const save = (id: string) =>
    setState((previous) => ({
      ...previous,
      savedJobIds: previous.savedJobIds.includes(id)
        ? previous.savedJobIds.filter((value) => value !== id)
        : [...previous.savedJobIds, id],
    }));
  const filters = (
    <>
      <div className="filter-heading">
        <h2>Refine your search</h2>
        <button
          className="link-button"
          onClick={() => {
            updateQuery("");
            setTypes([]);
            setVerified(false);
            setOverlap("Any schedule");
          }}
        >
          Reset
        </button>
      </div>
      <fieldset>
        <legend>Employment type</legend>
        {["Full-time", "Part-time", "Contract"].map((type) => (
          <label className="check-row" key={type}>
            <input
              type="checkbox"
              checked={types.includes(type)}
              onChange={() =>
                setTypes((current) =>
                  current.includes(type)
                    ? current.filter((value) => value !== type)
                    : [...current, type],
                )
              }
            />
            {type}
            <small>
              {jobs.filter((job) => job.employmentType === type).length}
            </small>
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Skills</legend>
        <label className="field-label">
          <input
            placeholder="e.g. Shopify, Notion, QuickBooks"
            aria-label="Filter by skill"
            onChange={(event) => updateQuery(event.target.value)}
          />
        </label>
        <div className="tags">
          <button onClick={() => updateQuery("Shopify")}>Shopify</button>
          <button onClick={() => updateQuery("Customer")}>
            Customer support
          </button>
          <button onClick={() => updateQuery("SEO")}>SEO</button>
        </div>
      </fieldset>
      <fieldset>
        <legend>Working schedule</legend>
        <select
          aria-label="Time zone overlap"
          value={overlap}
          onChange={(event) => setOverlap(event.target.value)}
        >
          <option>Any schedule</option>
          <option>US overlap</option>
          <option>Flexible schedule</option>
        </select>
      </fieldset>
      <fieldset>
        <legend>Employer verification</legend>
        <label className="check-row">
          <input
            type="checkbox"
            checked={verified}
            onChange={(event) => setVerified(event.target.checked)}
          />
          Verified employers
        </label>
      </fieldset>
      <div className="filter-help">
        <Bell size={20} />
        <h3>A good role is worth catching.</h3>
        <p>Get a heads-up when a job matches your skills.</p>
        <button
          className="button secondary full"
          onClick={() => setAlert(true)}
        >
          {alert ? "Alert saved" : "Create job alert"}
        </button>
      </div>
    </>
  );
  return (
    <div className="container browse-page">
      <PageHeading
        eyebrow="FIND YOUR NEXT CHAPTER"
        title="Remote work. Real possibilities."
        text="Find a role that fits your skills, schedule, and ambitions."
      />
      {alert && <Notice>Job alert saved for your selected skills.</Notice>}
      <div className="search-bar">
        <Search size={21} />
        <input
          aria-label="Search jobs"
          placeholder="e.g. Virtual assistant, Shopify, or bookkeeper"
          value={query}
          onChange={(event) => updateQuery(event.target.value)}
        />
        <button className="button" onClick={() => changePage(1)}>
          Search jobs <ArrowRight size={16} />
        </button>
        <button
          className="button secondary mobile-filter-button"
          onClick={() => setDrawer(true)}
        >
          <SlidersHorizontal size={17} />
          Filters
        </button>
      </div>
      <div className="browse-layout">
        <aside className="filter-panel">{filters}</aside>
        <section className="search-results">
          <div className="results-toolbar">
            <div>
              <strong>
                {displayed.length}{" "}
                {matched.length ? "matching roles" : "recommended roles"}
              </strong>
              <span>
                {matched.length
                  ? "Fresh opportunities from remote teams"
                  : "Related opportunities selected for you"}
              </span>
            </div>
            <label className="sort-control">
              <ArrowDownWideNarrow size={16} />
              <select
                aria-label="Sort jobs"
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setPage(1);
                }}
              >
                <option>Recommended</option>
                <option>Newest first</option>
                <option>Highest pay</option>
              </select>
            </label>
          </div>
          <div className="job-list">
            {pageJobs.map((job) => (
              <JobCard
                job={job}
                key={job.id}
                saved={state.savedJobIds.includes(job.id)}
                onSave={save}
              />
            ))}
          </div>
          <div className="pagination">
            <button
              className="button secondary"
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={cx(
                  "page-number",
                  currentPage === index + 1 && "active",
                )}
                aria-label={`Page ${index + 1}`}
                aria-current={currentPage === index + 1 ? "page" : undefined}
                onClick={() => changePage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="button secondary"
              disabled={currentPage === totalPages}
              onClick={() => changePage(currentPage + 1)}
            >
              Next <ArrowRight size={15} />
            </button>
          </div>
        </section>
      </div>
      {drawer && (
        <div className="drawer-overlay" onClick={() => setDrawer(false)}>
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Job search filters"
            className="filter-drawer"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.key === "Escape" && setDrawer(false)}
          >
            <button
              className="icon-button drawer-close"
              aria-label="Close filters"
              onClick={() => setDrawer(false)}
              autoFocus
            >
              <X />
            </button>
            {filters}
            <button className="button full" onClick={() => setDrawer(false)}>
              Show {displayed.length} roles <ArrowRight size={16} />
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
