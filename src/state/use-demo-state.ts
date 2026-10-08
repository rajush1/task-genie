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
import {
  EMPLOYER_ORGANIZATION_STORAGE_KEY,
  restoreEmployerOrganizationState,
  serializeEmployerOrganizationState,
} from "@/lib/employer-organization";

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
  const lastOrganizationSnapshot = useRef<string | null>(null);

  const update: DemoStateUpdater = useCallback((producer) => {
    let current = currentState.current;
    let persisted = lastStorageSnapshot.current;
    let organization = lastOrganizationSnapshot.current;
    try {
      persisted = window.localStorage.getItem(APPLY_POINTS_STORAGE_KEY);
      organization = window.localStorage.getItem(
        EMPLOYER_ORGANIZATION_STORAGE_KEY,
      );
    } catch {
      // Browser storage is optional for the prototype's current visit.
    }
    if (
      persisted !== lastStorageSnapshot.current ||
      organization !== lastOrganizationSnapshot.current
    ) {
      // Submissions create applications first. Employer stages then override only
      // matching applications, without losing the wallet or introduction details.
      current = restoreEmployerOrganizationState(
        syncApplyPointsState(current, persisted, jobs),
        organization,
      );
      lastStorageSnapshot.current = persisted;
      lastOrganizationSnapshot.current = organization;
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
    try {
      const serialized = serializeEmployerOrganizationState(next);
      if (
        window.localStorage.getItem(EMPLOYER_ORGANIZATION_STORAGE_KEY) !==
        serialized
      ) {
        window.localStorage.setItem(
          EMPLOYER_ORGANIZATION_STORAGE_KEY,
          serialized,
        );
      }
      lastOrganizationSnapshot.current = serialized;
    } catch {
      // Favorites, tags, and hiring stages still work in memory for this visit.
    }
  }, []);

  useEffect(() => {
    // Read browser storage after hydration, keeping the static first render stable.
    const frame = window.requestAnimationFrame(() => {
      let persisted: string | null = null;
      let organization: string | null = null;
      try {
        persisted = window.localStorage.getItem(APPLY_POINTS_STORAGE_KEY);
        organization = window.localStorage.getItem(
          EMPLOYER_ORGANIZATION_STORAGE_KEY,
        );
      } catch {
        // The populated prototype remains usable when browser storage is disabled.
      }
      const restored = restoreEmployerOrganizationState(
        syncApplyPointsState(currentState.current, persisted, jobs),
        organization,
      );
      currentState.current = restored;
      lastStorageSnapshot.current = persisted;
      lastOrganizationSnapshot.current = organization;
      setState(restored);
      setHydrated(true);
    });
    const onStorage = (event: StorageEvent) => {
      if (
        event.key !== APPLY_POINTS_STORAGE_KEY &&
        event.key !== EMPLOYER_ORGANIZATION_STORAGE_KEY &&
        event.key !== null
      )
        return;
      let snapshot =
        event.key === APPLY_POINTS_STORAGE_KEY
          ? event.newValue
          : lastStorageSnapshot.current;
      let organization =
        event.key === EMPLOYER_ORGANIZATION_STORAGE_KEY
          ? event.newValue
          : lastOrganizationSnapshot.current;
      try {
        // A queued event may describe an older write than the current snapshot.
        snapshot = window.localStorage.getItem(APPLY_POINTS_STORAGE_KEY);
        organization = window.localStorage.getItem(
          EMPLOYER_ORGANIZATION_STORAGE_KEY,
        );
      } catch {
        // The event still supplies a usable snapshot if storage is unavailable.
      }
      const restored = restoreEmployerOrganizationState(
        syncApplyPointsState(currentState.current, snapshot, jobs),
        organization,
      );
      lastStorageSnapshot.current = snapshot;
      lastOrganizationSnapshot.current = organization;
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
