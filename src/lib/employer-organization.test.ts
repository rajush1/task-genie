import { describe, expect, it } from "vitest";
import { initialApplications, jobs } from "../data/fixtures";
import type { MarketplaceState } from "../domain/types";
import { defaultState } from "./marketplace";
import {
  awardDailyApplyPoints,
  restoreApplyPointsState,
  serializeApplyPointsState,
  submitJobApplication,
} from "./apply-points";
import {
  addCandidateTag,
  getCandidateApplications,
  getJobApplications,
  removeCandidateTag,
  restoreEmployerOrganizationState,
  serializeEmployerOrganizationState,
  setApplicationStage,
  toggleFavoriteCandidate,
} from "./employer-organization";

const state = (): MarketplaceState => ({
  ...defaultState,
  applications: initialApplications,
});

describe("employer favorites and tags", () => {
  it("keeps a global favorites list independently of job shortlisting", () => {
    const current = state();
    const favorites = toggleFavoriteCandidate(current, "paolo");
    expect(favorites.favoritedCandidateIds).toContain("paolo");
    expect(favorites.applications).toBe(current.applications);
    const shortlisted = setApplicationStage(favorites, "app-1", "Shortlisted");
    expect(shortlisted.favoritedCandidateIds).toBe(
      favorites.favoritedCandidateIds,
    );
    expect(
      shortlisted.applications.find((item) => item.id === "app-1")?.stage,
    ).toBe("Shortlisted");
    const removed = toggleFavoriteCandidate(shortlisted, "maria");
    expect(removed.favoritedCandidateIds).not.toContain("maria");
    expect(removed.applications).toBe(shortlisted.applications);
  });

  it("accepts free-form tags, trims whitespace, and deduplicates without changing casing", () => {
    const current = state();
    const tagged = addCandidateTag(
      current,
      "paolo",
      "  Strong API + CRM background  ",
    );
    expect(tagged.candidateTags.paolo).toEqual(["Strong API + CRM background"]);
    expect(
      addCandidateTag(tagged, "paolo", "strong api + crm BACKGROUND"),
    ).toBe(tagged);
    expect(addCandidateTag(tagged, "paolo", "   ")).toBe(tagged);
    expect(tagged.applications).toBe(current.applications);
    expect(tagged.favoritedCandidateIds).toBe(current.favoritedCandidateIds);
  });

  it("allows tags and favorites before any job application and removes individual tags", () => {
    const current = { ...state(), applications: [] };
    const tagged = addCandidateTag(
      addCandidateTag(current, "maria", "Design partner"),
      "maria",
      "Async-ready",
    );
    const removed = removeCandidateTag(tagged, "maria", " ASYNC-READY ");
    expect(removed.candidateTags.maria).toContain("Design partner");
    expect(removed.candidateTags.maria).not.toContain("Async-ready");
    expect(
      toggleFavoriteCandidate(tagged, "paolo").favoritedCandidateIds,
    ).toContain("paolo");
    expect(removeCandidateTag(removed, "maria", "unknown")).toBe(removed);
    const single = addCandidateTag(current, "paolo", "Automation expert");
    expect(
      removeCandidateTag(single, "paolo", "Automation expert").candidateTags,
    ).not.toHaveProperty("paolo");
    expect(getCandidateApplications(tagged, "maria")).toEqual([]);
  });
});

describe("job-specific application stages", () => {
  it("only returns actual applications linked to valid jobs", () => {
    const current: MarketplaceState = {
      ...state(),
      applications: [
        ...initialApplications,
        {
          id: "missing-job",
          candidateId: "maria",
          jobTitle: "Legacy role",
          stage: "New",
          applyPoints: 5,
        },
        {
          id: "invalid-job",
          candidateId: "maria",
          jobId: "not-a-job",
          jobTitle: "Invalid role",
          stage: "New",
          applyPoints: 5,
        },
      ],
    };
    expect(
      getCandidateApplications(current, "maria").map((item) => item.id),
    ).toEqual(["app-1"]);
    expect(
      getJobApplications(current, "executive-assistant").map(
        (item) => item.candidateId,
      ),
    ).toEqual(["maria", "anne"]);
    expect(getJobApplications(current, "not-a-job")).toEqual([]);
    expect(setApplicationStage(current, "missing-job", "Shortlisted")).toBe(
      current,
    );
    expect(setApplicationStage(current, "invalid-job", "Shortlisted")).toBe(
      current,
    );
    expect(setApplicationStage(current, "no-application", "Shortlisted")).toBe(
      current,
    );
  });

  it("shortlists a candidate only for the selected job, not another application", () => {
    const current: MarketplaceState = {
      ...state(),
      applications: [
        ...initialApplications,
        {
          ...initialApplications[0],
          id: "maria-other-job",
          jobId: "customer-success",
          jobTitle: jobs.find((job) => job.id === "customer-success")!.title,
        },
      ],
    };
    const changed = setApplicationStage(current, "app-1", "Shortlisted");
    expect(
      getCandidateApplications(changed, "maria").map((item) => item.stage),
    ).toEqual(["Shortlisted", "New"]);
    expect(
      getJobApplications(changed, "customer-success").find(
        (item) => item.id === "maria-other-job",
      )?.stage,
    ).toBe("New");
    expect(setApplicationStage(changed, "app-1", "Shortlisted")).toBe(changed);
    expect(changed.favoritedCandidateIds).toBe(current.favoritedCandidateIds);
  });
});

describe("employer organization persistence", () => {
  it("restores favorites, free-form tags, and every seeded candidate's hiring stage", () => {
    let updated = toggleFavoriteCandidate(state(), "paolo");
    updated = addCandidateTag(updated, "paolo", "Discuss US overlap");
    updated = setApplicationStage(updated, "app-1", "Shortlisted");
    updated = setApplicationStage(updated, "app-3", "Offer");
    const serialized = serializeEmployerOrganizationState(updated);
    const restored = restoreEmployerOrganizationState(state(), serialized);
    expect(restored.favoritedCandidateIds).toEqual(
      [...updated.favoritedCandidateIds].sort(),
    );
    expect(restored.candidateTags).toEqual(updated.candidateTags);
    expect(restored.applications).toEqual(updated.applications);
    expect(restored.applyPoints).toBe(defaultState.applyPoints);
    expect(restored.jobApplications).toBe(defaultState.jobApplications);
    expect(JSON.parse(serialized)).not.toHaveProperty("applyPoints");
    expect(JSON.parse(serialized)).not.toHaveProperty("jobApplications");
  });

  it("preserves newly submitted jobs and restores Ana's stage after the AP snapshot", () => {
    const now = new Date(2026, 9, 8, 12, 0);
    const job = jobs.find((item) => item.id === "executive-assistant")!;
    const earned = awardDailyApplyPoints(state(), now);
    const result = submitJobApplication(
      earned,
      job,
      9,
      {
        subject: "Operations support",
        message: "Five years of executive support experience.",
      },
      now,
    );
    if (!result.ok) throw new Error(result.message);
    const employerUpdated = setApplicationStage(
      result.state,
      `apply-points-${job.id}`,
      "Interview",
    );
    const restored = restoreEmployerOrganizationState(
      restoreApplyPointsState(
        state(),
        serializeApplyPointsState(result.state),
        jobs,
      ),
      serializeEmployerOrganizationState(employerUpdated),
    );
    expect(restored.applyPoints).toEqual(result.state.applyPoints);
    expect(restored.applyPoints.balance).toBe(41);
    expect(restored.jobApplications).toEqual(result.state.jobApplications);
    expect(
      restored.jobApplications.find((item) => item.jobId === job.id)?.message,
    ).toBe("Five years of executive support experience.");
    expect(restored.appliedJobIds).toContain(job.id);
    expect(
      restored.applications.find((item) => item.id === `apply-points-${job.id}`)
        ?.stage,
    ).toBe("Interview");
    expect(awardDailyApplyPoints(restored, now)).toBe(restored);
    expect(
      submitJobApplication(
        restored,
        job,
        9,
        { subject: "Again", message: "Again" },
        now,
      ),
    ).toMatchObject({ ok: false, error: "already-applied" });
  });

  it("applies another tab's latest stage snapshot while retaining unseen applications", () => {
    const current = state();
    const remote = setApplicationStage(current, "app-1", "Offer");
    const newer: MarketplaceState = {
      ...current,
      applications: [
        ...current.applications,
        {
          ...initialApplications[1],
          id: "new-local-application",
          stage: "Interview",
        },
      ],
    };
    const restored = restoreEmployerOrganizationState(
      newer,
      serializeEmployerOrganizationState(remote),
    );
    expect(
      restored.applications.find((item) => item.id === "app-1")?.stage,
    ).toBe("Offer");
    expect(
      restored.applications.find((item) => item.id === "new-local-application")
        ?.stage,
    ).toBe("Interview");
    expect(restored.applications).toHaveLength(current.applications.length + 1);
  });

  it("never creates an application from stored employer data or changes a different job", () => {
    const current = state();
    const serialized = JSON.stringify({
      version: 1,
      applications: [
        {
          id: "fake-application",
          candidateId: "maria",
          jobId: "customer-success",
          stage: "Shortlisted",
        },
        {
          id: "app-1",
          candidateId: "maria",
          jobId: "customer-success",
          stage: "Offer",
        },
        {
          id: "app-2",
          candidateId: "maria",
          jobId: "customer-success",
          stage: "Offer",
        },
      ],
    });
    expect(restoreEmployerOrganizationState(current, serialized)).toBe(current);
  });

  it("keeps a populated presentation when storage is missing, malformed, or the wrong version", () => {
    const current = state();
    for (const value of [
      null,
      "",
      "broken JSON",
      "[]",
      '{"version":2}',
      '{"version":1,"favoritedCandidateIds":5,"candidateTags":null,"applications":[{"id":"app-1","stage":"Invalid"}]}',
    ]) {
      expect(restoreEmployerOrganizationState(current, value)).toBe(current);
    }
  });

  it("canonicalizes snapshots and normalizes stored tags without write ping-pong", () => {
    const current = state();
    const reordered = {
      ...current,
      favoritedCandidateIds: [...current.favoritedCandidateIds].reverse(),
      applications: [...current.applications].reverse(),
    };
    expect(serializeEmployerOrganizationState(reordered)).toBe(
      serializeEmployerOrganizationState(current),
    );
    expect(
      restoreEmployerOrganizationState(
        current,
        serializeEmployerOrganizationState(reordered),
      ),
    ).toBe(current);
    const restored = restoreEmployerOrganizationState(
      current,
      JSON.stringify({
        version: 1,
        candidateTags: {
          maria: [
            "  Good communicator ",
            "good COMMUNICATOR",
            "",
            "Calm under pressure",
          ],
        },
      }),
    );
    expect(restored.candidateTags.maria).toEqual([
      "Good communicator",
      "Calm under pressure",
    ]);
  });
});
