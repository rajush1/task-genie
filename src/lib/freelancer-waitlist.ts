export interface FreelancerWaitlistEntry {
  id: string;
  name: string;
  email: string;
  country: string;
  timezone: string;
  specialty: string;
  experience: string;
  availability: string;
  portfolio: string;
  joinedAt: string;
  updatedAt: string;
}

export type FreelancerWaitlistProfile = Omit<
  FreelancerWaitlistEntry,
  "id" | "joinedAt" | "updatedAt"
>;

export const WAITLIST_STORAGE_KEY = "task-genie-freelancer-waitlist-v1";

export const DEMO_WAITLIST_PROFILE: FreelancerWaitlistProfile = {
  name: "Ana Mendoza",
  email: "ana.mendoza@outlook.com",
  country: "Canada",
  timezone: "America/Toronto",
  specialty: "Executive assistance",
  experience: "5+ years",
  availability: "Full-time · 40 hours/week",
  portfolio: "https://anamendoza.work",
};

export function createWaitlistEntry(
  profile: FreelancerWaitlistProfile,
  existing?: FreelancerWaitlistEntry | null,
  now = new Date(),
): FreelancerWaitlistEntry {
  const timestamp = now.toISOString();
  const receiptId =
    existing?.id ??
    `TG-WL-${globalThis.crypto?.randomUUID?.() ?? `${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 10)}`}`;
  return {
    ...profile,
    email: profile.email.trim().toLowerCase(),
    id: receiptId,
    joinedAt: existing?.joinedAt ?? timestamp,
    updatedAt: timestamp,
  };
}

export function serializeFreelancerWaitlistEntry(
  entry: FreelancerWaitlistEntry,
): string {
  return JSON.stringify({ version: 1, entry });
}

export function restoreFreelancerWaitlistEntry(
  serialized: string | null,
): FreelancerWaitlistEntry | null {
  if (!serialized) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized);
  } catch {
    return null;
  }
  if (!isRecord(parsed) || parsed.version !== 1 || !isRecord(parsed.entry)) {
    return null;
  }
  const entry = parsed.entry;
  const fields = [
    "id",
    "name",
    "email",
    "country",
    "timezone",
    "specialty",
    "experience",
    "availability",
    "portfolio",
    "joinedAt",
    "updatedAt",
  ] as const;
  if (
    fields.some((field) => typeof entry[field] !== "string") ||
    !entry.id ||
    Number.isNaN(Date.parse(entry.joinedAt as string)) ||
    Number.isNaN(Date.parse(entry.updatedAt as string))
  ) {
    return null;
  }
  // Copy only the supported fields rather than trusting arbitrary stored data.
  return Object.fromEntries(
    fields.map((field) => [field, entry[field]]),
  ) as unknown as FreelancerWaitlistEntry;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function readFreelancerWaitlistEntry(
  storage: Pick<Storage, "getItem">,
): FreelancerWaitlistEntry | null {
  try {
    return restoreFreelancerWaitlistEntry(
      storage.getItem(WAITLIST_STORAGE_KEY),
    );
  } catch {
    return null;
  }
}

export function persistFreelancerWaitlistEntry(
  storage: Pick<Storage, "setItem">,
  entry: FreelancerWaitlistEntry,
): boolean {
  try {
    storage.setItem(
      WAITLIST_STORAGE_KEY,
      serializeFreelancerWaitlistEntry(entry),
    );
    return true;
  } catch {
    return false;
  }
}
