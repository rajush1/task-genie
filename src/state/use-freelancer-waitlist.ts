"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createWaitlistEntry,
  persistFreelancerWaitlistEntry,
  readFreelancerWaitlistEntry,
  restoreFreelancerWaitlistEntry,
  WAITLIST_STORAGE_KEY,
  type FreelancerWaitlistEntry,
  type FreelancerWaitlistProfile,
} from "@/lib/freelancer-waitlist";

export function useFreelancerWaitlist() {
  const [entry, setEntry] = useState<FreelancerWaitlistEntry | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [persisted, setPersisted] = useState(false);
  const currentEntry = useRef<FreelancerWaitlistEntry | null>(null);

  const save = useCallback((profile: FreelancerWaitlistProfile) => {
    let existing = currentEntry.current;
    try {
      // Read the latest receipt before saving to avoid duplicating another tab.
      existing = readFreelancerWaitlistEntry(window.localStorage) ?? existing;
    } catch {
      // Even accessing localStorage can fail in privacy-restricted browsers.
    }
    const next = createWaitlistEntry(profile, existing);
    let saved = false;
    try {
      saved = persistFreelancerWaitlistEntry(window.localStorage, next);
    } catch {
      // The in-memory confirmation still works if persistence is unavailable.
    }
    currentEntry.current = next;
    setEntry(next);
    setPersisted(saved);
    return next;
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (currentEntry.current) {
        // Do not overwrite a save or cross-tab update made before this frame.
        setHydrated(true);
        return;
      }
      let restored: FreelancerWaitlistEntry | null = null;
      try {
        restored = readFreelancerWaitlistEntry(window.localStorage);
      } catch {
        // Static HTML and the current visit remain usable without storage.
      }
      currentEntry.current = restored;
      setEntry(restored);
      setPersisted(Boolean(restored));
      setHydrated(true);
    });
    const onStorage = (event: StorageEvent) => {
      if (event.key !== WAITLIST_STORAGE_KEY && event.key !== null) return;
      let snapshot = event.newValue;
      try {
        // Prefer the latest value if multiple storage events are queued.
        snapshot = window.localStorage.getItem(WAITLIST_STORAGE_KEY);
      } catch {
        // Storage events include a snapshot even when storage access is blocked.
      }
      const restored = restoreFreelancerWaitlistEntry(snapshot);
      if (snapshot !== null && restored === null) return;
      currentEntry.current = restored;
      setEntry(restored);
      setPersisted(Boolean(restored));
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return { entry, hydrated, save, persisted };
}
