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
  applyPoints: {
    balance: 40,
    lastEarnedDate: null,
    history: [
      {
        id: "seed-daily-oct-6",
        kind: "daily",
        amount: 10,
        date: "2026-10-06T09:00:00.000Z",
        description: "Daily verified account visit",
      },
      {
        id: "seed-application-social-media-manager",
        kind: "application",
        amount: -5,
        date: "2026-10-05T11:30:00.000Z",
        description: "Application: Social Media Manager",
        jobId: "social-media-manager",
      },
      {
        id: "seed-daily-oct-5",
        kind: "daily",
        amount: 10,
        date: "2026-10-05T09:00:00.000Z",
        description: "Daily verified account visit",
      },
      {
        id: "seed-application-bookkeeper",
        kind: "application",
        amount: -5,
        date: "2026-10-04T11:30:00.000Z",
        description: "Application: QuickBooks Bookkeeper",
        jobId: "bookkeeper",
      },
      {
        id: "seed-daily-oct-4",
        kind: "daily",
        amount: 10,
        date: "2026-10-04T09:00:00.000Z",
        description: "Daily verified account visit",
      },
      {
        id: "seed-application-customer-success",
        kind: "application",
        amount: -5,
        date: "2026-10-03T11:30:00.000Z",
        description: "Application: Customer Success Coordinator",
        jobId: "customer-success",
      },
      {
        id: "seed-daily-oct-3",
        kind: "daily",
        amount: 10,
        date: "2026-10-03T09:00:00.000Z",
        description: "Daily verified account visit",
      },
      {
        id: "seed-application-content-operations",
        kind: "application",
        amount: -5,
        date: "2026-10-02T11:30:00.000Z",
        description: "Application: Content Operations Specialist",
        jobId: "content-operations",
      },
      {
        id: "seed-daily-oct-2",
        kind: "daily",
        amount: 10,
        date: "2026-10-02T09:00:00.000Z",
        description: "Daily verified account visit",
      },
      {
        id: "seed-daily-oct-1",
        kind: "daily",
        amount: 10,
        date: "2026-10-01T09:00:00.000Z",
        description: "Daily verified account visit",
      },
    ],
  },
  jobApplications: [
    {
      jobId: "content-operations",
      pointsUsed: 5,
      submittedAt: "2026-10-02T11:30:00.000Z",
      subject: "Content Operations Specialist — Ana Mendoza",
      message:
        "I bring five years of experience coordinating content calendars, documenting workflows, and keeping distributed teams on schedule. I would welcome the opportunity to support your content operations.",
    },
    {
      jobId: "customer-success",
      pointsUsed: 5,
      submittedAt: "2026-10-03T11:30:00.000Z",
      subject: "Customer Success Coordinator — Ana Mendoza",
      message:
        "I have managed customer support for growing e-commerce businesses and built a playbook that reduced first-response time from eight hours to two. I would love to bring that approach to your team.",
    },
    {
      jobId: "bookkeeper",
      pointsUsed: 5,
      submittedAt: "2026-10-04T11:30:00.000Z",
      subject: "QuickBooks Bookkeeper — Ana Mendoza",
      message:
        "My operations background includes invoice tracking, expense categorization, and preparing records for monthly reconciliation. I am organized, detail-oriented, and comfortable working with QuickBooks.",
    },
    {
      jobId: "social-media-manager",
      pointsUsed: 5,
      submittedAt: "2026-10-05T11:30:00.000Z",
      subject: "Social Media Manager — Ana Mendoza",
      message:
        "I help teams maintain consistent content schedules, organize creative assets, and report on campaign performance. I would be excited to support your social media program.",
    },
  ],
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
