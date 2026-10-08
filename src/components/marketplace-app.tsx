"use client";

import { useEffect, useState } from "react";
import { ROUTES } from "@/config/product";
import { useDemoState } from "@/state/use-demo-state";
import { Footer, Header, WorkspaceSidebar } from "@/components/shared";
import {
  ApplyPage,
  AuthPage,
  Home,
  HowItWorks,
  JobDetail,
  JobsPage,
  Pricing,
  InformationPage,
  SpaceCrewPage,
} from "@/features/public";
import {
  ApplicationsPage,
  Dashboard,
  Payments,
  ProfilePage,
  SavedPage,
  SettingsPage,
  VerificationPage,
} from "@/features/job-seeker";
import {
  EmployerTalent,
  Pipeline,
  PostJob,
  JobManagement,
  BillingPage,
} from "@/features/employer";
import { MessagesPage } from "@/features/workspace/messages";

const classNames = (...values: (string | false | undefined)[]) =>
  values.filter(Boolean).join(" ");

export function MarketplaceApp({ path }: { path: string }) {
  const [state, setState] = useDemoState();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");

  useEffect(() => {
    const readQuery = () =>
      setInitialQuery(
        new URLSearchParams(window.location.search).get("q") ?? "",
      );
    readQuery();
    window.addEventListener("popstate", readQuery);
    return () => window.removeEventListener("popstate", readQuery);
  }, [path]);
  const isEmployer = path.startsWith("/employer");
  const isApp = [
    "/dashboard",
    "/profile",
    "/saved-jobs",
    "/applications",
    "/settings",
    "/payments",
    "/messages",
  ].some((route) => path.startsWith(route));
  const workspace = isEmployer || isApp;

  return (
    <div className={classNames("app", workspace && "workspace-app")}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header
        path={path}
        appMode={workspace}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className={workspace ? "workspace" : ""}>
        {workspace && <WorkspaceSidebar path={path} employer={isEmployer} />}
        <main id="main" className={workspace ? "workspace-main" : ""}>
          {renderRoute(path, state, setState, initialQuery)}
        </main>
      </div>
      {!workspace && <Footer path={path} />}
    </div>
  );
}

function renderRoute(
  path: string,
  state: ReturnType<typeof useDemoState>[0],
  setState: ReturnType<typeof useDemoState>[1],
  initialQuery: string,
) {
  if (path === "/") return <Home />;
  if (path === ROUTES.jobs)
    return (
      <JobsPage
        key={initialQuery}
        state={state}
        setState={setState}
        initialQuery={initialQuery}
      />
    );
  const apply = path.match(/^\/jobs\/([^/]+)\/apply$/);
  if (apply)
    return <ApplyPage id={apply[1]} state={state} setState={setState} />;
  const detail = path.match(/^\/jobs\/([^/]+)$/);
  if (detail)
    return <JobDetail id={detail[1]} state={state} setState={setState} />;
  if (path === ROUTES.howItWorks) return <HowItWorks />;
  if (path === ROUTES.pricing) return <Pricing />;
  if (path === ROUTES.spacecrew) return <SpaceCrewPage />;
  if (path === ROUTES.trust) return <InformationPage kind="trust" />;
  if (path === ROUTES.support) return <InformationPage kind="support" />;
  if (path === ROUTES.about) return <InformationPage kind="about" />;
  if (path === ROUTES.login) return <AuthPage />;
  if (path === ROUTES.signup) return <AuthPage signup />;
  if (path === ROUTES.dashboard) return <Dashboard state={state} />;
  if (path === ROUTES.profile)
    return <ProfilePage state={state} setState={setState} />;
  if (path === ROUTES.verification)
    return <VerificationPage state={state} setState={setState} />;
  if (path === ROUTES.saved)
    return <SavedPage state={state} setState={setState} />;
  if (path === ROUTES.applications) return <ApplicationsPage state={state} />;
  if (path === ROUTES.payments) return <Payments />;
  if (path === ROUTES.settings) return <SettingsPage />;
  if (path === ROUTES.employerSettings) return <SettingsPage employer />;
  if (path === ROUTES.messages) return <MessagesPage />;
  if (path === ROUTES.employerMessages) return <MessagesPage employer />;
  if (path === ROUTES.talent)
    return (
      <EmployerTalent
        key={initialQuery}
        state={state}
        setState={setState}
        initialQuery={initialQuery}
      />
    );
  if (path === ROUTES.postJob) return <PostJob />;
  if (path === ROUTES.employerJobs) return <JobManagement />;
  if (path === ROUTES.employerBilling) return <BillingPage />;
  if (path === ROUTES.shortlist)
    return <EmployerTalent state={state} setState={setState} shortlist />;
  if (path === ROUTES.pipeline)
    return <Pipeline state={state} setState={setState} />;
  return <InformationPage kind="support" />;
}
