"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { initialApplications, jobs } from "@/data/fixtures";
import type { MarketplaceState } from "@/domain/types";
import { defaultState } from "@/lib/marketplace";
import {
  APPLY_POINTS_STORAGE_KEY,
  awardDailyApplyPoints,
  isApplyPointsVisit,
  serializeApplyPointsState,
  syncApplyPointsState,
} from "@/lib/apply-points";

export type DemoStateUpdater = (
  update: (state: MarketplaceState) => MarketplaceState,
) => void;

export function useDemoState(path?: string) {
  const [state, setState] = useState<MarketplaceState>({
    ...defaultState,
    applications: initialApplications,
  });
  const [hydrated, setHydrated] = useState(false);
  const currentState = useRef(state);
  const lastStorageSnapshot = useRef<string | null>(null);

  const update: DemoStateUpdater = useCallback((producer) => {
    let current = currentState.current;
    try {
      const persisted = window.localStorage.getItem(APPLY_POINTS_STORAGE_KEY);
      if (persisted !== lastStorageSnapshot.current) {
        current = syncApplyPointsState(current, persisted, jobs);
        lastStorageSnapshot.current = persisted;
      }
    } catch {
      // Browser storage is optional for the prototype's current visit.
    }
    const next = producer(current);
    currentState.current = next;
    setState(next);
    try {
      const serialized = serializeApplyPointsState(next);
      if (
        window.localStorage.getItem(APPLY_POINTS_STORAGE_KEY) !== serialized
      ) {
        window.localStorage.setItem(APPLY_POINTS_STORAGE_KEY, serialized);
      }
      lastStorageSnapshot.current = serialized;
    } catch {
      // Earning and applying still work for this visit if storage is unavailable.
    }
  }, []);

  useEffect(() => {
    // Read browser storage after hydration, keeping the static first render stable.
    const frame = window.requestAnimationFrame(() => {
      let persisted: string | null = null;
      try {
        persisted = window.localStorage.getItem(APPLY_POINTS_STORAGE_KEY);
      } catch {
        // The populated prototype remains usable when browser storage is disabled.
      }
      const restored = syncApplyPointsState(
        currentState.current,
        persisted,
        jobs,
      );
      currentState.current = restored;
      lastStorageSnapshot.current = persisted;
      setState(restored);
      setHydrated(true);
    });
    const onStorage = (event: StorageEvent) => {
      if (event.key !== APPLY_POINTS_STORAGE_KEY) return;
      let snapshot = event.newValue;
      try {
        // A queued event may describe an older write than the current snapshot.
        snapshot = window.localStorage.getItem(APPLY_POINTS_STORAGE_KEY);
      } catch {
        // The event still supplies a usable snapshot if storage is unavailable.
      }
      const restored = syncApplyPointsState(
        currentState.current,
        snapshot,
        jobs,
      );
      lastStorageSnapshot.current = snapshot;
      currentState.current = restored;
      setState(restored);
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !isApplyPointsVisit(path ?? window.location.pathname)) {
      return;
    }
    const visit = () => update((current) => awardDailyApplyPoints(current));
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") visit();
    };
    visit();
    window.addEventListener("focus", visit);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("focus", visit);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [hydrated, path, state.profile.verified, update]);

  return [state, update] as const;
}
