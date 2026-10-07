"use client";

import { useState } from "react";
import { initialApplications } from "@/data/fixtures";
import type { MarketplaceState } from "@/domain/types";
import { defaultState } from "@/lib/marketplace";

export type DemoStateUpdater = (
  update: (state: MarketplaceState) => MarketplaceState,
) => void;

export function useDemoState() {
  const [state, setState] = useState<MarketplaceState>({
    ...defaultState,
    applications: initialApplications,
  });

  // Every fresh visit starts with a complete, populated presentation state.
  const update: DemoStateUpdater = (producer) => setState(producer);

  return [state, update] as const;
}
