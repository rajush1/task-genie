import { jobs } from "../data/fixtures";
import type {
  Application,
  MarketplaceState,
  PipelineStage,
} from "../domain/types";

export const EMPLOYER_ORGANIZATION_STORAGE_KEY =
  "task-genie-employer-organization-v1";

const knownJobIds = new Set(jobs.map((job) => job.id));
const pipelineStages: PipelineStage[] = [
  "New",
  "Shortlisted",
  "Interview",
  "Offer",
];

function hasValidJob(application: Application): boolean {
  return (
    typeof application.jobId === "string" && knownJobIds.has(application.jobId)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  return tags.flatMap((value) => {
    const tag = value.trim();
    const key = tag.toLocaleLowerCase();
    if (!tag || seen.has(key)) return [];
    seen.add(key);
    return [tag];
  });
}

export function toggleFavoriteCandidate(
  state: MarketplaceState,
  candidateId: string,
): MarketplaceState {
  return {
    ...state,
    favoritedCandidateIds: state.favoritedCandidateIds.includes(candidateId)
      ? state.favoritedCandidateIds.filter((id) => id !== candidateId)
      : [...state.favoritedCandidateIds, candidateId],
  };
}

export function addCandidateTag(
  state: MarketplaceState,
  candidateId: string,
  value: string,
): MarketplaceState {
  const currentTags = state.candidateTags[candidateId] ?? [];
  const tags = normalizeTags([...currentTags, value]);
  if (tags.length === currentTags.length) return state;
  return {
    ...state,
    candidateTags: { ...state.candidateTags, [candidateId]: tags },
  };
}

export function removeCandidateTag(
  state: MarketplaceState,
  candidateId: string,
  value: string,
): MarketplaceState {
  const currentTags = state.candidateTags[candidateId] ?? [];
  const tag = value.trim().toLocaleLowerCase();
  const tags = currentTags.filter((item) => item.toLocaleLowerCase() !== tag);
  if (tags.length === currentTags.length) return state;
  const candidateTags = { ...state.candidateTags };
  if (tags.length) candidateTags[candidateId] = tags;
  else delete candidateTags[candidateId];
  return { ...state, candidateTags };
}

export function getCandidateApplications(
  state: MarketplaceState,
  candidateId: string,
): Application[] {
  return state.applications.filter(
    (application) =>
      application.candidateId === candidateId && hasValidJob(application),
  );
}

export function getJobApplications(
  state: MarketplaceState,
  jobId: string,
): Application[] {
  if (!knownJobIds.has(jobId)) return [];
  return state.applications.filter(
    (application) => application.jobId === jobId,
  );
}

export function setApplicationStage(
  state: MarketplaceState,
  applicationId: string,
  stage: PipelineStage,
): MarketplaceState {
  const application = state.applications.find(
    (item) => item.id === applicationId,
  );
  // A hiring stage belongs to an actual application for a known job, not a profile.
  if (
    !application ||
    !hasValidJob(application) ||
    !pipelineStages.includes(stage) ||
    application.stage === stage
  ) {
    return state;
  }
  return {
    ...state,
    applications: state.applications.map((item) =>
      item.id === applicationId ? { ...item, stage } : item,
    ),
  };
}

export function serializeEmployerOrganizationState(
  state: MarketplaceState,
): string {
  return JSON.stringify({
    version: 1,
    favoritedCandidateIds: [...new Set(state.favoritedCandidateIds)].sort(),
    candidateTags: Object.fromEntries(
      Object.entries(state.candidateTags)
        .sort(([first], [second]) => first.localeCompare(second))
        .map(([candidateId, tags]) => [candidateId, normalizeTags(tags)]),
    ),
    applications: state.applications
      .filter(hasValidJob)
      .map(({ id, candidateId, jobId, stage }) => ({
        id,
        candidateId,
        jobId,
        stage,
      }))
      .sort((first, second) => first.id.localeCompare(second.id)),
  });
}

export function restoreEmployerOrganizationState(
  initialState: MarketplaceState,
  serialized: string | null,
): MarketplaceState {
  if (!serialized) return initialState;
  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized);
  } catch {
    return initialState;
  }
  if (!isRecord(parsed) || parsed.version !== 1) return initialState;

  const favoritedCandidateIds =
    Array.isArray(parsed.favoritedCandidateIds) &&
    parsed.favoritedCandidateIds.every((id) => typeof id === "string")
      ? [...new Set(parsed.favoritedCandidateIds as string[])].filter(Boolean)
      : initialState.favoritedCandidateIds;

  const candidateTags = isRecord(parsed.candidateTags)
    ? Object.fromEntries(
        Object.entries(parsed.candidateTags).flatMap(([candidateId, tags]) =>
          Array.isArray(tags) && tags.every((tag) => typeof tag === "string")
            ? [[candidateId, normalizeTags(tags as string[])]]
            : [],
        ),
      )
    : initialState.candidateTags;

  const stageById = new Map<
    string,
    { candidateId: string; jobId: string; stage: PipelineStage }
  >();
  if (Array.isArray(parsed.applications)) {
    for (const application of parsed.applications) {
      if (
        isRecord(application) &&
        typeof application.id === "string" &&
        typeof application.candidateId === "string" &&
        typeof application.jobId === "string" &&
        knownJobIds.has(application.jobId) &&
        pipelineStages.includes(application.stage as PipelineStage)
      ) {
        stageById.set(application.id, {
          candidateId: application.candidateId,
          jobId: application.jobId,
          stage: application.stage as PipelineStage,
        });
      }
    }
  }
  const restored: MarketplaceState = {
    ...initialState,
    favoritedCandidateIds,
    candidateTags,
    applications: initialState.applications.map((application) => {
      const saved = stageById.get(application.id);
      return saved &&
        saved.candidateId === application.candidateId &&
        saved.jobId === application.jobId
        ? { ...application, stage: saved.stage }
        : application;
    }),
  };
  return serializeEmployerOrganizationState(restored) ===
    serializeEmployerOrganizationState(initialState)
    ? initialState
    : restored;
}
