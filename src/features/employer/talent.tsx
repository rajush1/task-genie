"use client";

import { useState } from "react";
import Link from "next/link";
import { BadgeCheck, Search, Users } from "lucide-react";
import { candidates } from "@/data/fixtures";
import { ROUTES } from "@/config/product";
import type { MarketplaceState } from "@/domain/types";
import type { DemoStateUpdater } from "@/state/use-demo-state";
import {
  AppLayout,
  Badge,
  CandidateDetail,
  CandidateRow,
  cx,
  PageHeading,
} from "@/components/shared";

export function EmployerTalent({
  state,
  setState,
  shortlist = false,
  initialQuery = "",
}: {
  state: MarketplaceState;
  setState: DemoStateUpdater;
  shortlist?: boolean;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [selected, setSelected] = useState(candidates[0].id);
  const [compare, setCompare] = useState(false);
  const [skill, setSkill] = useState("All skills");
  const [country, setCountry] = useState("All countries");
  const [availability, setAvailability] = useState("Any availability");
  const [verified, setVerified] = useState(false);
  const pool = shortlist
    ? candidates.filter((candidate) =>
        state.shortlistedCandidateIds.includes(candidate.id),
      )
    : candidates;
  const matched = pool.filter(
    (candidate) =>
      [candidate.name, candidate.role, ...candidate.skills]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (skill === "All skills" || candidate.skills.includes(skill)) &&
      (country === "All countries" || candidate.country === country) &&
      (!verified || candidate.verified) &&
      (availability === "Any availability" ||
        candidate.availability.includes("Available now")),
  );
  const displayed = matched.length
    ? matched
    : pool.length
      ? pool
      : candidates.slice(0, 3);
  const candidate =
    displayed.find((item) => item.id === selected) ?? displayed[0];
  const toggle = () =>
    setState((previous) => ({
      ...previous,
      shortlistedCandidateIds: previous.shortlistedCandidateIds.includes(
        candidate.id,
      )
        ? previous.shortlistedCandidateIds.filter((id) => id !== candidate.id)
        : [...previous.shortlistedCandidateIds, candidate.id],
    }));
  return (
    <AppLayout>
      <PageHeading
        eyebrow="NORTHSTAR COMMERCE / RECRUITING"
        title={
          shortlist
            ? "Good people, one shortlist."
            : "Your next great teammate is here."
        }
        text={
          shortlist
            ? "Compare your saved professionals and keep the conversation moving."
            : "Find professionals worldwide with the skills and experience your team needs."
        }
        action={
          <Link className="button" href={ROUTES.postJob}>
            ＋ Post a job
          </Link>
        }
      />
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
            {displayed.length} {matched.length ? "matching" : "recommended"}{" "}
            professionals
          </strong>
          <span>Review work samples, availability, and expected pay.</span>
        </div>
        <button
          className="button secondary small"
          onClick={() => setCompare(!compare)}
        >
          <Users size={16} />
          {compare ? "Hide comparison" : "Compare candidates"}
        </button>
      </div>
      {compare && (
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
      <div className="candidate-layout">
        <div className="candidate-list">
          {displayed.map((item) => (
            <CandidateRow
              candidate={item}
              selected={item.id === candidate.id}
              onClick={() => setSelected(item.id)}
              key={item.id}
            />
          ))}
        </div>
        <CandidateDetail
          candidate={candidate}
          shortlisted={state.shortlistedCandidateIds.includes(candidate.id)}
          toggle={toggle}
        />
      </div>
    </AppLayout>
  );
}
