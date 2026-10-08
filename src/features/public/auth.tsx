"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { ROUTES } from "@/config/product";
import { cx, TextField } from "@/components/shared";

export function AuthPage({ signup = false }: { signup?: boolean }) {
  const [role, setRole] = useState("worker");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  return (
    <div className="auth-surface">
      <div className="auth-page">
        <section className="auth-story">
          <span className="eyebrow">A BETTER WAY TO WORK TOGETHER</span>
          <h1>
            The right connection.
            <br />
            <em>A whole new chapter.</em>
          </h1>
          <p>
            Bring your ambition. Find your people. Build a lasting relationship
            with a team that values your work.
          </p>
          <div className="auth-benefits">
            {[
              "Find full-time, part-time, and project roles",
              "Connect directly with employers and professionals",
              "Keep applications and conversations in one place",
            ].map((item) => (
              <span key={item}>
                <Check size={19} />
                {item}
              </span>
            ))}
          </div>
          <div className="auth-story-card">
            <ShieldCheck size={27} />
            <div>
              <strong>A marketplace built around trust.</strong>
              <p>Clear profiles, transparent terms, and practical support.</p>
            </div>
          </div>
        </section>
        <section className="auth-form">
          <Link className="back-link" href="/">
            <ArrowLeft size={16} />
            Back to marketplace
          </Link>
          <span className="eyebrow">
            {signup ? "GET STARTED" : "WELCOME BACK"}
          </span>
          <h1>{signup ? "Make your next move." : "Good to see you again."}</h1>
          <p>
            {signup
              ? "Join from anywhere in the world and explore what comes next."
              : "Your next opportunity is waiting in your workspace."}
          </p>
          <div className="role-choice">
            <button
              className={cx(role === "worker" && "active")}
              onClick={() => setRole("worker")}
            >
              <BriefcaseBusiness size={20} />
              <strong>I’m looking for work</strong>
              <span>Build your remote career</span>
            </button>
            <button
              className={cx(role === "employer" && "active")}
              onClick={() => setRole("employer")}
            >
              <Users size={20} />
              <strong>I’m hiring talent</strong>
              <span>Build your remote team</span>
            </button>
          </div>
          <form
            key={role}
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              router.push(role === "worker" ? ROUTES.dashboard : ROUTES.talent);
            }}
          >
            {signup && (
              <>
                <TextField
                  label="Full name"
                  defaultValue={
                    role === "worker" ? "Ana Mendoza" : "Emma Wilson"
                  }
                />
                <TextField
                  label="Country or region"
                  defaultValue={role === "worker" ? "Canada" : "United States"}
                  placeholder="e.g. Canada, India, or Brazil"
                />
                <TextField
                  label="Time zone"
                  defaultValue={
                    role === "worker" ? "America/Toronto" : "America/New_York"
                  }
                  placeholder="e.g. Asia/Kolkata"
                />
              </>
            )}
            <TextField
              label="Email address"
              defaultValue={
                role === "worker"
                  ? "ana.mendoza@outlook.com"
                  : "emma@northstarcommerce.com"
              }
              placeholder="Your email address"
            />
            <label className="field-label">
              Password
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  defaultValue="RemoteWork2026"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            {signup ? (
              <label className="check-row">
                <input type="checkbox" defaultChecked />I agree to the Terms of
                Use and Privacy Policy.
              </label>
            ) : (
              <div className="auth-options">
                <label className="check-row">
                  <input type="checkbox" defaultChecked />
                  Remember me
                </label>
                <Link href={ROUTES.support}>Forgot password?</Link>
              </div>
            )}
            <button className="button full">
              {signup ? "Create account" : "Open workspace"}
              <ArrowRight size={17} />
            </button>
          </form>
          {signup && role === "worker" && (
            <div className="auth-waitlist-note">
              <Sparkles size={19} aria-hidden="true" />
              <div>
                <strong>Prefer to join the freelancer waitlist?</strong>
                <p>No account needed. You can still explore the prototype.</p>
                <Link className="text-link" href={ROUTES.waitlist}>
                  Join the waitlist <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
          <p className="auth-switch">
            {signup ? "Already have an account?" : "New to Task Genie?"}{" "}
            <Link href={signup ? ROUTES.login : ROUTES.signup}>
              {signup ? "Log in" : "Get started"}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
