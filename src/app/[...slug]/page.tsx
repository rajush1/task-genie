import type { Metadata } from "next";
import { MarketplaceApp } from "@/components/marketplace-app";
import { ROUTES } from "@/config/product";
import { jobs } from "@/data/fixtures";

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug.join("/") !== "spacecrew") return {};
  return {
    title: "SpaceCrew — Managed virtual assistant services",
    description:
      "Explore SpaceCrew, the managed virtual assistant service from Task Genie Inc. Get support for recruiting, staffing, and managing remote professionals.",
  };
}

export function generateStaticParams() {
  const routes = Object.values(ROUTES).flatMap((route) =>
    typeof route === "string" && route !== "/" ? [route] : [],
  );
  const jobRoutes = jobs.flatMap((job) => [
    `/jobs/${job.id}`,
    `/jobs/${job.id}/apply`,
  ]);

  return [...routes, ...jobRoutes].map((route) => ({
    slug: route.slice(1).split("/"),
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  return <MarketplaceApp path={`/${slug.join("/")}`} />;
}
