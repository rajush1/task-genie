"use client";

import { useId, useState } from "react";
import { Plus, Star, Tag, X } from "lucide-react";
import type { MarketplaceState } from "@/domain/types";
import type { DemoStateUpdater } from "@/state/use-demo-state";
import {
  addCandidateTag,
  removeCandidateTag,
  toggleFavoriteCandidate,
} from "@/lib/employer-organization";
import { cx } from "./ui";

export function CandidateOrganizationControls({
  candidateId,
  candidateName,
  state,
  setState,
}: {
  candidateId: string;
  candidateName: string;
  state: MarketplaceState;
  setState: DemoStateUpdater;
}) {
  const inputId = useId();
  const [tag, setTag] = useState("");
  const [notice, setNotice] = useState("");
  const favorite = state.favoritedCandidateIds.includes(candidateId);
  const tags = state.candidateTags[candidateId] ?? [];

  return (
    <section
      className="candidate-organization"
      aria-label={`Organize ${candidateName}`}
    >
      <button
        type="button"
        className={cx(
          "button secondary favorite-action",
          favorite && "is-selected",
        )}
        aria-pressed={favorite}
        onClick={() => {
          setState((previous) =>
            toggleFavoriteCandidate(previous, candidateId),
          );
          setNotice(
            favorite
              ? "Removed from your Favorites."
              : "Added to your Favorites.",
          );
        }}
      >
        <Star size={16} fill={favorite ? "currentColor" : "none"} />
        {favorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
      <p className="organization-hint">
        Your running talent list, independent of job applications.
      </p>
      <form
        className="candidate-tag-form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (!tag.trim()) return;
          setState((previous) => addCandidateTag(previous, candidateId, tag));
          setNotice(`Tag “${tag.trim()}” saved.`);
          setTag("");
        }}
      >
        <label htmlFor={inputId}>
          <Tag size={14} /> Your employer tags
        </label>
        <div className="candidate-tag-input">
          <input
            id={inputId}
            placeholder="e.g. Strong communicator"
            value={tag}
            onChange={(event) => setTag(event.target.value)}
          />
          <button
            type="submit"
            className="button secondary small"
            aria-label="Add employer tag"
          >
            <Plus size={15} /> Add
          </button>
        </div>
        <small>
          Free-form labels for your team. These do not change application
          stages.
        </small>
      </form>
      {tags.length > 0 && (
        <ul
          className="employer-tag-list"
          aria-label={`Employer tags for ${candidateName}`}
        >
          {tags.map((item) => (
            <li key={item}>
              <span>{item}</span>
              <button
                type="button"
                aria-label={`Remove tag ${item}`}
                onClick={() => {
                  setState((previous) =>
                    removeCandidateTag(previous, candidateId, item),
                  );
                  setNotice(`Tag “${item}” removed.`);
                }}
              >
                <X size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <span className="organization-status" role="status">
        {notice}
      </span>
    </section>
  );
}
