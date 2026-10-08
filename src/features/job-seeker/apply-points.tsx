"use client";

import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  Check,
  Coins,
  ShieldCheck,
} from "lucide-react";
import type { MarketplaceState } from "@/domain/types";
import { ROUTES } from "@/config/product";
import {
  DAILY_APPLY_POINTS,
  MAX_APPLY_POINTS,
  localDateKey,
} from "@/lib/apply-points";
import { AppLayout, Badge, PageHeading } from "@/components/shared";

export function pointsDate(value: string) {
  return new Date(
    value.length === 10 ? `${value}T12:00:00` : value,
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ApplyPointsSummary({
  state,
  compact = false,
}: {
  state: MarketplaceState;
  compact?: boolean;
}) {
  const visitedToday = state.applyPoints.lastEarnedDate === localDateKey();
  return (
    <section
      className={`points-summary ${compact ? "points-summary-compact" : ""}`}
      aria-label="Apply Points balance"
    >
      <span className="points-symbol">
        <Coins size={compact ? 23 : 30} />
      </span>
      <div className="points-summary-copy">
        <span className="eyebrow">YOUR APPLY POINTS</span>
        <div className="points-balance">
          <strong>{state.applyPoints.balance}</strong>
          <span>/ {MAX_APPLY_POINTS} AP</span>
        </div>
        <p>
          {!state.profile.verified
            ? "Verify your profile to earn daily points."
            : visitedToday
              ? "Today’s visit is recorded. Come back tomorrow to earn more."
              : "Your verified daily visit earns up to 10 free points."}
        </p>
      </div>
      <Link className="button secondary" href={ROUTES.applyPoints}>
        View Apply Points <ArrowRight size={16} />
      </Link>
    </section>
  );
}

export function ApplyPointsPage({ state }: { state: MarketplaceState }) {
  const visitedToday = state.applyPoints.lastEarnedDate === localDateKey();
  return (
    <AppLayout>
      <PageHeading
        eyebrow="A LITTLE INTENTION GOES A LONG WAY"
        title="Your next opportunity starts here."
        text="Earn points by showing up. Use them to show employers which opportunities matter to you."
        action={
          <Link className="button" href={ROUTES.jobs}>
            Explore jobs <ArrowRight size={16} />
          </Link>
        }
      />
      <div className="points-wallet-layout">
        <section className="points-wallet card">
          <div className="points-wallet-heading">
            <span className="points-symbol">
              <Coins size={27} />
            </span>
            <Badge tone="neutral">Free to earn · Never for sale</Badge>
          </div>
          <span className="eyebrow">AVAILABLE TO APPLY</span>
          <div className="points-balance">
            <strong>{state.applyPoints.balance}</strong>
            <span>Apply Points</span>
          </div>
          <div className="points-cap">
            <span>Balance limit</span>
            <strong>
              {state.applyPoints.balance} / {MAX_APPLY_POINTS} AP
            </strong>
          </div>
          <div
            className="meter"
            role="progressbar"
            aria-label="Apply Points balance"
            aria-valuenow={state.applyPoints.balance}
            aria-valuemin={0}
            aria-valuemax={MAX_APPLY_POINTS}
          >
            <span
              style={{
                width: `${(state.applyPoints.balance / MAX_APPLY_POINTS) * 100}%`,
              }}
            />
          </div>
          <p>
            Unused points stay in your balance. Spend them on roles you’re
            genuinely interested in.
          </p>
          <div className="points-daily-status">
            <CalendarCheck size={20} />
            <div>
              <strong>
                {!state.profile.verified
                  ? "Verification unlocks daily points"
                  : visitedToday
                    ? "You’re all set for today"
                    : "Daily points are ready"}
              </strong>
              <span>
                {!state.profile.verified
                  ? "Complete the prototype verification to start earning."
                  : state.applyPoints.balance === MAX_APPLY_POINTS
                    ? "You’re at the 60-point limit. Use points, then return on a new day."
                    : visitedToday
                      ? "Your next top-up is on your first visit tomorrow."
                      : "Your first signed-in visit each day adds up to 10 AP."}
              </span>
            </div>
            {visitedToday && <Check size={17} />}
          </div>
          {!state.profile.verified && (
            <Link className="text-link" href={ROUTES.verification}>
              Complete verification <ArrowRight size={15} />
            </Link>
          )}
        </section>
        <section className="card points-how">
          <span className="eyebrow">SMALL HABIT. BETTER OPPORTUNITIES.</span>
          <h2>How Apply Points work</h2>
          <ol>
            <li>
              <span>01</span>
              <div>
                <h3>Visit daily, earn {DAILY_APPLY_POINTS} AP</h3>
                <p>
                  A verified account earns points once per calendar day. You
                  don’t need to submit an application.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Save up to {MAX_APPLY_POINTS} points</h3>
                <p>
                  Unused points carry over. Daily top-ups stop at the 60-point
                  balance limit.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Choose your points when you apply</h3>
                <p>
                  Use at least 1 AP per application, up to your available
                  balance. Points are deducted only after submission.
                </p>
              </div>
            </li>
          </ol>
          <div className="points-interest-note">
            <ShieldCheck size={19} />
            <p>
              Points express interest, not ability. Employers still review your
              profile, experience, and introduction. Submitted points aren’t
              refunded if you’re not selected.
            </p>
          </div>
        </section>
      </div>
      <section className="table-card points-history">
        <div className="table-title">
          <div>
            <h2>Your points activity</h2>
            <p>A clear record of what you earned and where you used it.</p>
          </div>
          <Badge tone="neutral">Latest first</Badge>
        </div>
        <div className="points-transactions">
          {[...state.applyPoints.history]
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((item) => (
              <div className="points-transaction" key={item.id}>
                <span
                  className={`points-transaction-icon ${item.kind === "daily" ? "earned" : "spent"}`}
                >
                  {item.kind === "daily" ? (
                    <ArrowDownLeft size={19} />
                  ) : (
                    <ArrowUpRight size={19} />
                  )}
                </span>
                <div>
                  <strong>{item.description}</strong>
                  <time dateTime={item.date}>{pointsDate(item.date)}</time>
                </div>
                <strong
                  className={item.amount > 0 ? "points-earned" : "points-spent"}
                >
                  {item.amount > 0 ? "+" : ""}
                  {item.amount} AP
                </strong>
                {item.jobId && (
                  <Link
                    className="icon-button"
                    href={ROUTES.job(item.jobId)}
                    aria-label={`View role for ${item.description}`}
                  >
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>
            ))}
        </div>
      </section>
      <p className="points-prototype-note">
        Prototype preview: points and submitted applications are saved only in
        this browser. No real applications are sent.
      </p>
    </AppLayout>
  );
}
