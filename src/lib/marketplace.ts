import type { Job, MarketplaceState } from "../domain/types";
export const defaultState: MarketplaceState = {
  savedJobIds: [
    "content-operations",
    "executive-assistant",
    "automation-crm",
    "shopify-specialist",
  ],
  appliedJobIds: [
    "content-operations",
    "customer-success",
    "bookkeeper",
    "social-media-manager",
  ],
  shortlistedCandidateIds: ["joshua", "maria", "bea"],
  applications: [],
  profile: {
    headline:
      "Executive Virtual Assistant | Shopify, Notion & Customer Support",
    bio: "I support founders and e-commerce teams with calendar management, customer care, and documented workflows. Over the past five years, I have managed executive schedules across three time zones, maintained Shopify catalogs, and built a support playbook that reduced first-response time from 8 hours to 2 hours. I work proactively, communicate clearly, and keep the details moving.",
    skills: [
      "Executive support",
      "Shopify",
      "Notion",
      "Google Workspace",
      "Customer support",
    ],
    portfolio: "https://anamendoza.com/portfolio",
    resume: true,
    verified: true,
  },
};
export function filterJobs(
  jobs: Job[],
  query: string,
  types: string[],
  verifiedOnly: boolean,
) {
  const needle = query.trim().toLowerCase();
  return jobs.filter((job) => {
    const text = [job.title, job.company, job.category, ...job.skills]
      .join(" ")
      .toLowerCase();
    return (
      (!needle || text.includes(needle)) &&
      (types.length === 0 || types.includes(job.employmentType)) &&
      (!verifiedOnly || job.verified)
    );
  });
}
export function profileCompleteness(profile: MarketplaceState["profile"]) {
  const fields = [
    Boolean(profile.headline),
    profile.bio.length >= 40,
    profile.skills.length >= 3,
    Boolean(profile.portfolio),
    profile.resume,
    profile.verified,
  ];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}
