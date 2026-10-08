import type {
  Application,
  ApplyPointsTransaction,
  ApplyPointsWallet,
  Job,
  JobApplication,
  MarketplaceState,
} from "../domain/types";

export const DAILY_APPLY_POINTS = 10;
export const MAX_APPLY_POINTS = 60;
export const MIN_APPLICATION_POINTS = 1;
export const APPLY_POINTS_STORAGE_KEY = "task-genie-apply-points-v1";

export function localDateKey(now = new Date()): string {
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

export function isApplyPointsVisit(path: string): boolean {
  const normalized = path.replace(/\/$/, "");
  return (
    /^\/(dashboard|profile|saved-jobs|applications|apply-points|settings|payments|messages)(\/|$)/.test(
      normalized,
    ) || /^\/jobs\/[^/]+\/apply$/.test(normalized)
  );
}

export function awardDailyApplyPoints(
  state: MarketplaceState,
  now = new Date(),
): MarketplaceState {
  const date = localDateKey(now);
  if (!state.profile.verified || state.applyPoints.lastEarnedDate === date) {
    return state;
  }
  const amount = Math.min(
    DAILY_APPLY_POINTS,
    MAX_APPLY_POINTS - state.applyPoints.balance,
  );
  const transaction: ApplyPointsTransaction = {
    id: `daily-${date}`,
    kind: "daily",
    amount,
    date: now.toISOString(),
    description: "Daily verified account visit",
  };
  return {
    ...state,
    applyPoints: {
      balance: state.applyPoints.balance + amount,
      lastEarnedDate: date,
      history:
        amount > 0
          ? [transaction, ...state.applyPoints.history]
          : state.applyPoints.history,
    },
  };
}

type ApplicationError =
  | "already-applied"
  | "verification-required"
  | "invalid-points"
  | "insufficient-points";

export type SubmitApplicationResult =
  | { ok: true; state: MarketplaceState; application: JobApplication }
  | { ok: false; error: ApplicationError; message: string };

export function submitJobApplication(
  state: MarketplaceState,
  job: Job,
  points: number,
  details: { subject: string; message: string },
  now = new Date(),
): SubmitApplicationResult {
  if (
    state.appliedJobIds.includes(job.id) ||
    state.jobApplications.some((application) => application.jobId === job.id)
  ) {
    return {
      ok: false,
      error: "already-applied",
      message:
        "You have already applied for this role. Your points were not charged again.",
    };
  }
  if (!state.profile.verified) {
    return {
      ok: false,
      error: "verification-required",
      message:
        "Verify your account to earn Apply Points and send applications.",
    };
  }
  if (!Number.isInteger(points) || points < MIN_APPLICATION_POINTS) {
    return {
      ok: false,
      error: "invalid-points",
      message: "Choose at least 1 whole Apply Point for this application.",
    };
  }
  if (points > state.applyPoints.balance) {
    return {
      ok: false,
      error: "insufficient-points",
      message:
        "You do not have enough Apply Points for this amount. Choose a lower amount or return tomorrow to earn more.",
    };
  }
  const submittedAt = now.toISOString();
  const application: JobApplication = {
    jobId: job.id,
    pointsUsed: points,
    submittedAt,
    subject: details.subject,
    message: details.message,
  };
  const employerApplication: Application = {
    id: `apply-points-${job.id}`,
    candidateId: "ana",
    jobId: job.id,
    jobTitle: job.title,
    stage: "New",
    applyPoints: points,
  };
  return {
    ok: true,
    application,
    state: {
      ...state,
      appliedJobIds: [...state.appliedJobIds, job.id],
      jobApplications: [...state.jobApplications, application],
      applications: [employerApplication, ...state.applications],
      applyPoints: {
        ...state.applyPoints,
        balance: state.applyPoints.balance - points,
        history: [
          {
            id: `application-${job.id}`,
            kind: "application",
            amount: -points,
            date: submittedAt,
            description: `Application: ${job.title}`,
            jobId: job.id,
          },
          ...state.applyPoints.history,
        ],
      },
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTimestamp(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function isCalendarDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const parsed = new Date(`${value}T12:00:00.000Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function readWallet(value: unknown): ApplyPointsWallet | null {
  if (
    !isRecord(value) ||
    !Number.isInteger(value.balance) ||
    (value.balance as number) < 0 ||
    (value.balance as number) > MAX_APPLY_POINTS ||
    !(value.lastEarnedDate === null || isCalendarDate(value.lastEarnedDate)) ||
    !Array.isArray(value.history)
  ) {
    return null;
  }
  const history = value.history.filter(
    (entry): entry is ApplyPointsTransaction =>
      isRecord(entry) &&
      typeof entry.id === "string" &&
      typeof entry.description === "string" &&
      isTimestamp(entry.date) &&
      Number.isInteger(entry.amount) &&
      ((entry.kind === "daily" &&
        (entry.amount as number) > 0 &&
        (entry.amount as number) <= DAILY_APPLY_POINTS) ||
        (entry.kind === "application" &&
          (entry.amount as number) < 0 &&
          (entry.amount as number) >= -MAX_APPLY_POINTS)) &&
      (entry.jobId === undefined || typeof entry.jobId === "string"),
  );
  return {
    balance: value.balance as number,
    lastEarnedDate: value.lastEarnedDate as string | null,
    history: history.slice(0, 120),
  };
}

export function serializeApplyPointsState(state: MarketplaceState): string {
  return JSON.stringify({
    version: 1,
    applyPoints: state.applyPoints,
    jobApplications: [...state.jobApplications].sort((first, second) =>
      first.jobId.localeCompare(second.jobId),
    ),
    profileVerified: state.profile.verified,
    applications: state.applications
      .filter(
        (application) => application.candidateId === "ana" && application.jobId,
      )
      .sort((first, second) => first.id.localeCompare(second.id)),
  });
}

export function restoreApplyPointsState(
  initialState: MarketplaceState,
  serialized: string | null,
  knownJobs: Job[],
): MarketplaceState {
  if (!serialized) return initialState;
  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized);
  } catch {
    return initialState;
  }
  if (!isRecord(parsed) || parsed.version !== 1) return initialState;

  const knownJobIds = new Set(knownJobs.map((job) => job.id));
  const applicationsByJob = new Map(
    initialState.jobApplications.map((application) => [
      application.jobId,
      application,
    ]),
  );
  if (Array.isArray(parsed.jobApplications)) {
    for (const entry of parsed.jobApplications) {
      if (
        isRecord(entry) &&
        typeof entry.jobId === "string" &&
        knownJobIds.has(entry.jobId) &&
        Number.isInteger(entry.pointsUsed) &&
        (entry.pointsUsed as number) >= MIN_APPLICATION_POINTS &&
        (entry.pointsUsed as number) <= MAX_APPLY_POINTS &&
        isTimestamp(entry.submittedAt) &&
        typeof entry.subject === "string" &&
        typeof entry.message === "string"
      ) {
        applicationsByJob.set(entry.jobId, {
          jobId: entry.jobId,
          pointsUsed: entry.pointsUsed as number,
          submittedAt: entry.submittedAt,
          subject: entry.subject,
          message: entry.message,
        });
      }
    }
  }
  const jobApplications = [...applicationsByJob.values()];
  const employerApplications = new Map(
    initialState.applications.map((application) => [
      application.id,
      application,
    ]),
  );
  if (Array.isArray(parsed.applications)) {
    for (const entry of parsed.applications) {
      if (
        !isRecord(entry) ||
        entry.candidateId !== "ana" ||
        typeof entry.jobId !== "string"
      ) {
        continue;
      }
      const submitted = applicationsByJob.get(entry.jobId);
      const job = knownJobs.find((item) => item.id === entry.jobId);
      if (!submitted || !job) continue;
      const stage = ["New", "Shortlisted", "Interview", "Offer"].includes(
        String(entry.stage),
      )
        ? (entry.stage as Application["stage"])
        : "New";
      const id = `apply-points-${job.id}`;
      employerApplications.set(id, {
        id,
        candidateId: "ana",
        jobId: job.id,
        jobTitle: job.title,
        stage,
        applyPoints: submitted.pointsUsed,
      });
    }
  }
  return {
    ...initialState,
    applyPoints: readWallet(parsed.applyPoints) ?? initialState.applyPoints,
    jobApplications,
    appliedJobIds: [
      ...new Set([...initialState.appliedJobIds, ...applicationsByJob.keys()]),
    ],
    applications: [...employerApplications.values()],
    profile: {
      ...initialState.profile,
      verified:
        typeof parsed.profileVerified === "boolean"
          ? parsed.profileVerified
          : initialState.profile.verified,
    },
  };
}

export function syncApplyPointsState(
  currentState: MarketplaceState,
  serialized: string | null,
  knownJobs: Job[],
): MarketplaceState {
  const restored = restoreApplyPointsState(currentState, serialized, knownJobs);
  return serializeApplyPointsState(restored) ===
    serializeApplyPointsState(currentState)
    ? currentState
    : restored;
}
