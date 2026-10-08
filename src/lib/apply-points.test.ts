import { describe, expect, it } from "vitest";
import { initialApplications, jobs } from "../data/fixtures";
import type { MarketplaceState } from "../domain/types";
import {
  awardDailyApplyPoints,
  isApplyPointsVisit,
  localDateKey,
  restoreApplyPointsState,
  serializeApplyPointsState,
  submitJobApplication,
  syncApplyPointsState,
} from "./apply-points";
import { defaultState } from "./marketplace";

const firstVisit = new Date(2026, 9, 8, 23, 55);
const nextDay = new Date(2026, 9, 9, 0, 5);
const job = jobs.find((item) => item.id === "executive-assistant")!;
const details = {
  subject: "Executive Assistant — Ana Mendoza",
  message: "I bring five years supporting founders and distributed teams.",
};
const state = (): MarketplaceState => ({
  ...defaultState,
  applications: initialApplications,
});

describe("daily Apply Points", () => {
  it("earns 10 once per local date and carries unused points forward", () => {
    const earned = awardDailyApplyPoints(state(), firstVisit);
    expect(earned.applyPoints.balance).toBe(50);
    expect(earned.applyPoints.lastEarnedDate).toBe("2026-10-08");
    expect(earned.applyPoints.history[0].amount).toBe(10);
    expect(awardDailyApplyPoints(earned, firstVisit)).toBe(earned);
    expect(awardDailyApplyPoints(earned, nextDay).applyPoints.balance).toBe(60);
    expect(localDateKey(new Date(2026, 0, 2, 0, 1))).toBe("2026-01-02");
  });

  it("requires verification and credits only the available room below 60", () => {
    const unverified = {
      ...state(),
      profile: { ...state().profile, verified: false },
    };
    expect(awardDailyApplyPoints(unverified, firstVisit)).toBe(unverified);
    const nearlyFull = {
      ...state(),
      applyPoints: { ...state().applyPoints, balance: 56 },
    };
    const earned = awardDailyApplyPoints(nearlyFull, firstVisit);
    expect(earned.applyPoints.balance).toBe(60);
    expect(earned.applyPoints.history[0].amount).toBe(4);
  });

  it("credits a newly verified account on the same visit", () => {
    const unverified = {
      ...state(),
      profile: { ...state().profile, verified: false },
    };
    const beforeVerification = awardDailyApplyPoints(unverified, firstVisit);
    const verified = {
      ...beforeVerification,
      profile: { ...beforeVerification.profile, verified: true },
    };
    const earned = awardDailyApplyPoints(verified, firstVisit);
    expect(earned.applyPoints.balance).toBe(50);
    expect(earned.applyPoints.lastEarnedDate).toBe("2026-10-08");
  });

  it("records a visit at the cap so spending cannot trigger another daily credit", () => {
    const full = {
      ...state(),
      applyPoints: { ...state().applyPoints, balance: 60 },
    };
    const visited = awardDailyApplyPoints(full, firstVisit);
    expect(visited.applyPoints.history).toEqual(full.applyPoints.history);
    expect(visited.applyPoints.lastEarnedDate).toBe("2026-10-08");
    const submitted = submitJobApplication(
      visited,
      job,
      10,
      details,
      firstVisit,
    );
    expect(submitted.ok).toBe(true);
    if (!submitted.ok) throw new Error(submitted.message);
    expect(
      awardDailyApplyPoints(submitted.state, firstVisit).applyPoints.balance,
    ).toBe(50);
  });

  it("awards points only on job seeker workspace and application visits", () => {
    for (const path of [
      "/dashboard",
      "/profile/verification",
      "/apply-points/",
      "/jobs/executive-assistant/apply",
    ]) {
      expect(isApplyPointsVisit(path)).toBe(true);
    }
    for (const path of [
      "/",
      "/spacecrew",
      "/jobs",
      "/jobs/executive-assistant",
      "/employer/applications",
      "/signup",
      "/dashboard-extra",
    ]) {
      expect(isApplyPointsVisit(path)).toBe(false);
    }
  });
});

describe("application point spending", () => {
  it("debits once and records the same amount for the candidate and employer", () => {
    const current = awardDailyApplyPoints(state(), firstVisit);
    const result = submitJobApplication(current, job, 12, details, firstVisit);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.message);
    expect(result.state.applyPoints.balance).toBe(38);
    expect(result.state.applyPoints.history[0]).toMatchObject({
      kind: "application",
      amount: -12,
      jobId: job.id,
    });
    expect(result.state.appliedJobIds).toContain(job.id);
    expect(result.application).toMatchObject({
      jobId: job.id,
      pointsUsed: 12,
      ...details,
    });
    expect(result.state.applications[0]).toMatchObject({
      candidateId: "ana",
      jobId: job.id,
      applyPoints: 12,
      stage: "New",
    });
    const duplicate = submitJobApplication(
      result.state,
      job,
      5,
      details,
      firstVisit,
    );
    expect(duplicate).toMatchObject({ ok: false, error: "already-applied" });
    expect(result.state.applyPoints.balance).toBe(38);
  });

  it("rejects fractional, zero, missing, and unaffordable points without mutating state", () => {
    const current = state();
    for (const points of [0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(
        submitJobApplication(current, job, points, details, firstVisit),
      ).toMatchObject({ ok: false, error: "invalid-points" });
    }
    expect(
      submitJobApplication(current, job, 41, details, firstVisit),
    ).toMatchObject({ ok: false, error: "insufficient-points" });
    expect(current.applyPoints.balance).toBe(40);
    expect(current.appliedJobIds).not.toContain(job.id);
  });

  it("allows spending the entire balance and preserves existing applications", () => {
    const result = submitJobApplication(state(), job, 40, details, firstVisit);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.message);
    expect(result.state.applyPoints.balance).toBe(0);
    expect(result.state.jobApplications).toHaveLength(
      defaultState.jobApplications.length + 1,
    );
    expect(result.state.applications).toHaveLength(
      initialApplications.length + 1,
    );
  });
});

describe("Apply Points persistence", () => {
  it("adopts another tab's wallet and submissions while preserving local presentation changes", () => {
    const earned = awardDailyApplyPoints(state(), firstVisit);
    const submitted = submitJobApplication(earned, job, 9, details, firstVisit);
    if (!submitted.ok) throw new Error(submitted.message);
    const otherTab = {
      ...state(),
      savedJobIds: [],
      profile: { ...state().profile, headline: "Updated in this tab" },
    };
    const synced = syncApplyPointsState(
      otherTab,
      serializeApplyPointsState(submitted.state),
      jobs,
    );
    expect(synced.applyPoints.balance).toBe(41);
    expect(synced.jobApplications).toContainEqual(submitted.application);
    expect(synced.appliedJobIds).toContain(job.id);
    expect(
      synced.applications.find((entry) => entry.candidateId === "ana")
        ?.applyPoints,
    ).toBe(9);
    expect(synced.savedJobIds).toEqual([]);
    expect(synced.profile.headline).toBe("Updated in this tab");
  });

  it("canonicalizes equivalent snapshots to avoid cross-tab write ping-pong", () => {
    const current = state();
    const reordered = {
      ...current,
      jobApplications: [...current.jobApplications].reverse(),
      applications: [...current.applications].reverse(),
    };
    expect(serializeApplyPointsState(reordered)).toBe(
      serializeApplyPointsState(current),
    );
    expect(
      syncApplyPointsState(current, serializeApplyPointsState(reordered), jobs),
    ).toBe(current);
    expect(syncApplyPointsState(current, "broken storage", jobs)).toBe(current);
  });

  it("restores wallet, sent applications, verification and user-created hiring entries across visits", () => {
    const earned = awardDailyApplyPoints(state(), firstVisit);
    const result = submitJobApplication(earned, job, 9, details, firstVisit);
    if (!result.ok) throw new Error(result.message);
    const saved = serializeApplyPointsState({
      ...result.state,
      savedJobIds: [],
      profile: {
        ...result.state.profile,
        headline: "Temporary change",
        verified: false,
      },
    });
    const restored = restoreApplyPointsState(state(), saved, jobs);
    expect(restored.applyPoints.balance).toBe(41);
    expect(restored.applyPoints.lastEarnedDate).toBe("2026-10-08");
    expect(restored.jobApplications).toContainEqual(result.application);
    expect(
      restored.applications.find(
        (application) => application.candidateId === "ana",
      )?.applyPoints,
    ).toBe(9);
    expect(restored.profile.verified).toBe(false);
    expect(restored.profile.headline).toBe(defaultState.profile.headline);
    expect(restored.savedJobIds).toEqual(defaultState.savedJobIds);
    expect(JSON.parse(saved)).not.toHaveProperty("savedJobIds");
    expect(JSON.parse(saved).applications).toHaveLength(1);
  });

  it("preserves a complete seeded presentation when storage is absent or malformed", () => {
    const initial = state();
    for (const serialized of [
      null,
      "",
      "invalid json",
      "[]",
      '{"version":4}',
    ]) {
      expect(restoreApplyPointsState(initial, serialized, jobs)).toBe(initial);
    }
    const invalid = JSON.stringify({
      version: 1,
      applyPoints: {
        balance: "NaN",
        lastEarnedDate: "2026-02-31",
        history: [],
      },
      jobApplications: [
        { jobId: job.id, pointsUsed: 0 },
        { jobId: "unknown", pointsUsed: 5 },
      ],
      applications: [{ candidateId: "ana", jobId: "unknown", stage: "Offer" }],
      profileVerified: "yes",
    });
    const restored = restoreApplyPointsState(initial, invalid, jobs);
    expect(restored.applyPoints).toEqual(defaultState.applyPoints);
    expect(restored.jobApplications).toEqual(defaultState.jobApplications);
    expect(restored.applications).toEqual(initialApplications);
    expect(restored.profile.verified).toBe(true);
  });

  it("does not charge or award again after restoring the same day's application", () => {
    const earned = awardDailyApplyPoints(state(), firstVisit);
    const result = submitJobApplication(earned, job, 7, details, firstVisit);
    if (!result.ok) throw new Error(result.message);
    const restored = restoreApplyPointsState(
      state(),
      serializeApplyPointsState(result.state),
      jobs,
    );
    expect(awardDailyApplyPoints(restored, firstVisit)).toBe(restored);
    expect(
      submitJobApplication(restored, job, 7, details, firstVisit),
    ).toMatchObject({ ok: false, error: "already-applied" });
    expect(restored.applyPoints.balance).toBe(43);
  });
});
