import { describe, expect, it } from "vitest";
import {
  createWaitlistEntry,
  DEMO_WAITLIST_PROFILE,
  persistFreelancerWaitlistEntry,
  readFreelancerWaitlistEntry,
  restoreFreelancerWaitlistEntry,
  serializeFreelancerWaitlistEntry,
  WAITLIST_STORAGE_KEY,
} from "./freelancer-waitlist";

const joinedAt = new Date("2026-10-08T09:00:00.000Z");
const updatedAt = new Date("2026-10-09T12:00:00.000Z");

describe("freelancer waitlist receipts", () => {
  it("creates a browser-local receipt with a normalized email and worldwide profile", () => {
    const entry = createWaitlistEntry(
      { ...DEMO_WAITLIST_PROFILE, email: "  ANA.MENDOZA@outlook.com " },
      null,
      joinedAt,
    );
    expect(entry).toMatchObject({
      ...DEMO_WAITLIST_PROFILE,
      email: "ana.mendoza@outlook.com",
      joinedAt: joinedAt.toISOString(),
      updatedAt: joinedAt.toISOString(),
    });
    expect(entry.id).toMatch(/^TG-WL-/);
  });

  it("updates one receipt without adding a second signup or changing its join date", () => {
    const first = createWaitlistEntry(DEMO_WAITLIST_PROFILE, null, joinedAt);
    const updated = createWaitlistEntry(
      {
        ...DEMO_WAITLIST_PROFILE,
        country: "Kenya",
        timezone: "Africa/Nairobi",
        specialty: "Customer support",
      },
      first,
      updatedAt,
    );
    expect(updated).toMatchObject({
      id: first.id,
      joinedAt: first.joinedAt,
      updatedAt: updatedAt.toISOString(),
      country: "Kenya",
      timezone: "Africa/Nairobi",
      specialty: "Customer support",
    });
    expect(first.country).toBe("Canada");
  });

  it("does not impose required-field or email-format validation in the prototype", () => {
    const entry = createWaitlistEntry(
      { ...DEMO_WAITLIST_PROFILE, name: "", email: "prototype", portfolio: "" },
      null,
      joinedAt,
    );
    expect(entry.name).toBe("");
    expect(entry.email).toBe("prototype");
    expect(entry.portfolio).toBe("");
    expect(
      restoreFreelancerWaitlistEntry(serializeFreelancerWaitlistEntry(entry)),
    ).toEqual(entry);
  });

  it("round-trips a complete receipt and strips unknown stored fields", () => {
    const entry = createWaitlistEntry(DEMO_WAITLIST_PROFILE, null, joinedAt);
    expect(
      restoreFreelancerWaitlistEntry(serializeFreelancerWaitlistEntry(entry)),
    ).toEqual(entry);
    const extraData = JSON.stringify({
      version: 1,
      entry: { ...entry, rank: 42 },
    });
    expect(restoreFreelancerWaitlistEntry(extraData)).toEqual(entry);
    expect(restoreFreelancerWaitlistEntry(extraData)).not.toHaveProperty(
      "rank",
    );
  });

  it("safely ignores absent, malformed, obsolete, and incomplete snapshots", () => {
    for (const snapshot of [
      null,
      "",
      "invalid json",
      "[]",
      "null",
      '{"version": 2, "entry": {}}',
      '{"version": 1, "entry": {}}',
      '{"version": 1, "entry": []}',
    ]) {
      expect(restoreFreelancerWaitlistEntry(snapshot)).toBeNull();
    }
    const entry = createWaitlistEntry(DEMO_WAITLIST_PROFILE, null, joinedAt);
    for (const invalid of [
      { ...entry, id: "" },
      { ...entry, country: 123 },
      { ...entry, joinedAt: "invalid date" },
      { ...entry, updatedAt: null },
    ]) {
      expect(
        restoreFreelancerWaitlistEntry(
          JSON.stringify({ version: 1, entry: invalid }),
        ),
      ).toBeNull();
    }
  });

  it("persists only one receipt under its own storage key", () => {
    const snapshots = new Map<string, string>();
    const storage = {
      getItem: (key: string) => snapshots.get(key) ?? null,
      setItem: (key: string, value: string) => snapshots.set(key, value),
    };
    const first = createWaitlistEntry(DEMO_WAITLIST_PROFILE, null, joinedAt);
    expect(persistFreelancerWaitlistEntry(storage, first)).toBe(true);
    const updated = createWaitlistEntry(
      { ...DEMO_WAITLIST_PROFILE, experience: "7+ years" },
      readFreelancerWaitlistEntry(storage),
      updatedAt,
    );
    expect(persistFreelancerWaitlistEntry(storage, updated)).toBe(true);
    expect(snapshots.size).toBe(1);
    expect([...snapshots.keys()]).toEqual([WAITLIST_STORAGE_KEY]);
    expect(readFreelancerWaitlistEntry(storage)).toEqual(updated);
    expect(updated.id).toBe(first.id);
  });

  it("allows an in-memory receipt when browser storage is unavailable", () => {
    const storage = {
      getItem: () => {
        throw new Error("Browser storage is blocked");
      },
      setItem: () => {
        throw new Error("Browser storage is full");
      },
    };
    const entry = createWaitlistEntry(DEMO_WAITLIST_PROFILE, null, joinedAt);
    expect(readFreelancerWaitlistEntry(storage)).toBeNull();
    expect(persistFreelancerWaitlistEntry(storage, entry)).toBe(false);
    expect(entry).toMatchObject({
      name: "Ana Mendoza",
      joinedAt: joinedAt.toISOString(),
    });
  });
});
