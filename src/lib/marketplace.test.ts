import { describe, expect, it } from "vitest";
import {
  candidates,
  conversations,
  employerConversations,
  initialApplications,
  jobs,
} from "../data/fixtures";
import { defaultState, filterJobs, profileCompleteness } from "./marketplace";
describe("marketplace logic", () => {
  it("filters by query, type, and verification", () => {
    expect(
      filterJobs(jobs, "HubSpot", ["Full-time"], true).map((job) => job.id),
    ).toEqual(["executive-assistant"]);
  });
  it("calculates profile completion", () => {
    expect(
      profileCompleteness({
        headline: "Hi",
        bio: "short",
        skills: [],
        portfolio: "",
        resume: false,
        verified: true,
      }),
    ).toBe(33);
  });
});

describe("populated product preview", () => {
  it("offers worldwide roles and professionals across regions", () => {
    expect(jobs.every((job) => job.location === "Remote · Worldwide")).toBe(
      true,
    );
    expect(
      new Set(candidates.map((candidate) => candidate.country)).size,
    ).toBeGreaterThanOrEqual(6);
    expect(
      candidates.every((candidate) =>
        candidate.location.includes(candidate.country),
      ),
    ).toBe(true);
  });
  it("starts with complete records in saved, applied, favorites, and hiring views", () => {
    expect(
      defaultState.savedJobIds.every((id) => jobs.some((job) => job.id === id)),
    ).toBe(true);
    expect(defaultState.savedJobIds.length).toBeGreaterThan(0);
    expect(defaultState.appliedJobIds.length).toBeGreaterThan(0);
    expect(
      defaultState.favoritedCandidateIds.every((id) =>
        candidates.some((candidate) => candidate.id === id),
      ),
    ).toBe(true);
    expect(
      initialApplications.every((application) =>
        jobs.some(
          (job) =>
            job.id === application.jobId && job.title === application.jobTitle,
        ),
      ),
    ).toBe(true);
    for (const stage of ["New", "Shortlisted", "Interview", "Offer"]) {
      expect(
        initialApplications.some((application) => application.stage === stage),
      ).toBe(true);
    }
    expect(profileCompleteness(defaultState.profile)).toBe(100);
  });
  it("provides complete job briefs and distinct conversations for both account types", () => {
    for (const job of jobs) {
      expect(job.description.length).toBeGreaterThan(0);
      expect(job.responsibilities?.length).toBeGreaterThan(0);
      expect(job.qualifications?.length).toBeGreaterThan(0);
      expect(job.benefits?.length).toBeGreaterThan(0);
    }
    for (const thread of [...conversations, ...employerConversations]) {
      expect(thread.messages.length).toBeGreaterThanOrEqual(3);
      expect(
        thread.messages.some((message) => message.sender === thread.name),
      ).toBe(true);
    }
  });
});
