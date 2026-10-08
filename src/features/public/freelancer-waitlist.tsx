"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronDown,
  Globe2,
  Mail,
  Pencil,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge, TextField } from "@/components/shared";
import { ROUTES } from "@/config/product";
import {
  DEMO_WAITLIST_PROFILE,
  type FreelancerWaitlistProfile,
} from "@/lib/freelancer-waitlist";
import { useFreelancerWaitlist } from "@/state/use-freelancer-waitlist";

const specialties = [
  "Executive assistance & operations",
  "Customer support & success",
  "E-commerce & store management",
  "Marketing & social media",
  "Bookkeeping & accounting",
  "Design & creative",
  "Web & software development",
  "Automation & CRM",
];
const experienceOptions = [
  "Less than 1 year",
  "1–2 years",
  "3–4 years",
  "5–7 years",
  "8+ years",
];
const availabilityOptions = [
  "Full-time · 40 hours/week",
  "Part-time · 20 hours/week",
  "Project-based",
  "Exploring future opportunities",
];

export function FreelancerWaitlistPage() {
  const { entry, hydrated, save, persisted } = useFreelancerWaitlist();
  const [editing, setEditing] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const receiptHeading = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const profile = entry ?? DEMO_WAITLIST_PROFILE;
  const showReceipt = Boolean(entry && !editing);
  useEffect(() => {
    if (editing)
      formRef.current
        ?.querySelector<HTMLInputElement>('input[name="name"]')
        ?.focus();
    else if (justSaved) receiptHeading.current?.focus();
  }, [editing, justSaved]);

  return (
    <div className="freelancer-waitlist-page">
      <section className="waitlist-hero">
        <div className="container waitlist-hero-grid">
          <div className="waitlist-story">
            <span className="waitlist-kicker">
              <span /> GLOBAL FREELANCER WAITLIST
            </span>
            <h1>
              Your talent.
              <br />A world of
              <br />
              <em>possibilities.</em>
            </h1>
            <p>
              Good work starts with the right connection. Tell us what you do
              best and join the interest list for future freelancer onboarding
              updates.
            </p>
            <a className="button waitlist-jump" href="#waitlist-form">
              Join the waitlist <ArrowRight size={16} />
            </a>
            <div className="waitlist-story-benefits">
              <div>
                <Globe2 size={21} />
                <span>
                  <strong>Wherever you call home</strong>
                  <small>
                    Open to freelancers in every country and time zone.
                  </small>
                </span>
              </div>
              <div>
                <BriefcaseBusiness size={21} />
                <span>
                  <strong>Your expertise, your next chapter</strong>
                  <small>
                    From virtual assistance to creative, technical, and
                    specialist work.
                  </small>
                </span>
              </div>
              <div>
                <Sparkles size={21} />
                <span>
                  <strong>A thoughtful first introduction</strong>
                  <small>
                    Share your focus and availability. No account needed to
                    join.
                  </small>
                </span>
              </div>
            </div>
            <div className="waitlist-path">
              <span>
                01 <strong>Share your details</strong>
              </span>
              <ArrowRight size={15} />
              <span>
                02 <strong>Register your interest</strong>
              </span>
            </div>
            <p className="waitlist-story-note">
              Already exploring Task Genie?{" "}
              <Link href={ROUTES.jobs}>
                Browse the job preview <ArrowRight size={14} />
              </Link>
            </p>
          </div>

          <div className="waitlist-form-card" id="waitlist-form">
            {showReceipt && entry ? (
              <section
                className="waitlist-receipt"
                aria-labelledby="waitlist-receipt-title"
                aria-live="polite"
              >
                <span className="waitlist-success-icon">
                  <CheckCircle2 size={33} />
                </span>
                <Badge tone="neutral">FREELANCER WAITLIST · PREVIEW</Badge>
                <h2
                  id="waitlist-receipt-title"
                  ref={receiptHeading}
                  tabIndex={-1}
                >
                  {justSaved
                    ? "Your interest is saved."
                    : "Your waitlist details."}
                </h2>
                <p>
                  Thanks, {entry.name.split(" ")[0] || "there"}. Your freelancer
                  preferences are ready to review below.
                </p>
                <dl className="waitlist-receipt-details">
                  <div>
                    <dt>Name</dt>
                    <dd>{entry.name || "Not specified"}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{entry.email || "Not specified"}</dd>
                  </div>
                  <div>
                    <dt>Based in</dt>
                    <dd>{entry.country || "Worldwide"}</dd>
                  </div>
                  <div>
                    <dt>Time zone</dt>
                    <dd>{entry.timezone || "Flexible"}</dd>
                  </div>
                  <div>
                    <dt>Professional focus</dt>
                    <dd>{entry.specialty || "Open to opportunities"}</dd>
                  </div>
                  <div>
                    <dt>Availability</dt>
                    <dd>{entry.availability || "To be discussed"}</dd>
                  </div>
                  <div>
                    <dt>Experience</dt>
                    <dd>{entry.experience || "Not specified"}</dd>
                  </div>
                  <div>
                    <dt>Portfolio / profile</dt>
                    <dd>{entry.portfolio || "Not specified"}</dd>
                  </div>
                </dl>
                <div className="waitlist-prototype-disclosure">
                  <ShieldCheck size={19} />
                  <p>
                    {persisted
                      ? "Saved only in this browser. No email has been sent and no live waitlist registration has been created."
                      : "This preview is saved for this visit only because browser storage is unavailable. No email has been sent."}
                  </p>
                </div>
                <button
                  className="button full"
                  onClick={() => setEditing(true)}
                >
                  <Pencil size={16} />
                  Edit my details
                </button>
                <Link className="waitlist-secondary-link" href={ROUTES.jobs}>
                  Explore the job preview <ArrowRight size={15} />
                </Link>
              </section>
            ) : (
              <>
                <div className="waitlist-form-heading">
                  <span className="waitlist-form-symbol">
                    <Mail size={23} />
                  </span>
                  <span>FREE TO JOIN · OPEN WORLDWIDE</span>
                </div>
                <h2>
                  {editing
                    ? "Keep your details up to date."
                    : "Make your introduction."}
                </h2>
                <p className="waitlist-form-intro">
                  {editing
                    ? "Update your existing preview entry—no duplicate signup needed."
                    : "A little about you. A clearer picture of the work you’re looking for."}
                </p>
                <form
                  ref={formRef}
                  key={entry?.id ?? "new"}
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault();
                    const data = new FormData(event.currentTarget);
                    const details = Object.fromEntries(
                      Object.keys(DEMO_WAITLIST_PROFILE).map((key) => [
                        key,
                        String(data.get(key) ?? ""),
                      ]),
                    ) as FreelancerWaitlistProfile;
                    save(details);
                    setJustSaved(true);
                    setEditing(false);
                  }}
                >
                  <div className="waitlist-fields-grid">
                    <TextField
                      label="Full name"
                      name="name"
                      autoComplete="name"
                      defaultValue={profile.name}
                      placeholder="Ana Mendoza"
                    />
                    <TextField
                      label="Email address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      defaultValue={profile.email}
                      placeholder="ana.mendoza@outlook.com"
                    />
                    <TextField
                      label="Country or region"
                      name="country"
                      autoComplete="country-name"
                      defaultValue={profile.country}
                      placeholder="e.g. Canada, India, or Brazil"
                    />
                    <TextField
                      label="Time zone"
                      name="timezone"
                      defaultValue={profile.timezone}
                      placeholder="e.g. America/Toronto or Asia/Kolkata"
                    />
                  </div>
                  <label className="field-label">
                    Primary expertise
                    <select name="specialty" defaultValue={profile.specialty}>
                      {[...new Set([profile.specialty, ...specialties])].map(
                        (item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                  <div className="waitlist-fields-grid">
                    <label className="field-label">
                      Professional experience
                      <select
                        name="experience"
                        defaultValue={profile.experience}
                      >
                        {[
                          ...new Set([
                            profile.experience,
                            ...experienceOptions,
                          ]),
                        ].map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="field-label">
                      Preferred work arrangement
                      <select
                        name="availability"
                        defaultValue={profile.availability}
                      >
                        {[
                          ...new Set([
                            profile.availability,
                            ...availabilityOptions,
                          ]),
                        ].map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <TextField
                    label="Portfolio or professional profile"
                    name="portfolio"
                    defaultValue={profile.portfolio}
                    placeholder="Your portfolio, LinkedIn, or selected work"
                  />
                  <div className="waitlist-form-disclosure">
                    <ShieldCheck size={16} />
                    <span>
                      Prototype form with example details. Saved locally in this
                      browser only; no information or emails are sent.
                    </span>
                  </div>
                  <button className="button full" disabled={!hydrated}>
                    {editing
                      ? "Save my details"
                      : "Join the freelancer waitlist"}
                    <ArrowRight size={17} />
                  </button>
                  {editing && (
                    <button
                      type="button"
                      className="waitlist-cancel"
                      onClick={() => setEditing(false)}
                    >
                      Keep my current details
                    </button>
                  )}
                  <p className="waitlist-no-promises">
                    Joining registers interest, not a job application or a
                    guarantee of work.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
      <section className="container waitlist-next">
        <div className="waitlist-next-heading">
          <span className="eyebrow">GOOD TO KNOW</span>
          <h2>A simple start. Clear expectations.</h2>
          <p>A waitlist for professionals—not another job application.</p>
        </div>
        <div className="waitlist-next-grid">
          <article>
            <span>01</span>
            <h3>Tell us your focus</h3>
            <p>
              Share your expertise, location, and preferred working arrangement
              so your interest has useful context.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Keep your options open</h3>
            <p>
              The waitlist is separate from Task Genie registration and Apply
              Points. You can still explore the marketplace prototype.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Know what comes next</h3>
            <p>
              A live service would use these details to send onboarding updates.
              This prototype demonstrates the signup and confirmation flow only.
            </p>
          </article>
        </div>
      </section>
      <section
        className="container waitlist-faq"
        aria-label="Freelancer waitlist questions"
      >
        <div>
          <span className="eyebrow">A FEW QUICK ANSWERS</span>
          <h2>Before you join.</h2>
          <p>
            Open worldwide. Free to join.
            <br />
            No account required.
          </p>
        </div>
        <div className="waitlist-faq-items">
          {[
            [
              "Who is the waitlist for?",
              "Freelancers and remote professionals worldwide, including virtual assistants, customer support specialists, marketers, designers, developers, bookkeepers, and operations professionals.",
            ],
            [
              "Is joining the same as applying for a job?",
              "No. The waitlist registers your interest in future freelancer onboarding updates. It does not submit a job application, reserve a job, or guarantee work.",
            ],
            [
              "Does it cost money or Apply Points?",
              "No. Joining the freelancer waitlist is free and does not use Apply Points. Points are separate and are used only when applying for roles in the prototype.",
            ],
            [
              "Will I receive an email from this prototype?",
              "No. This static preview saves your entry only in this browser. There is no live waitlist database or email delivery service connected.",
            ],
          ].map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <ChevronDown size={17} />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <div className="container waitlist-bottom-note">
        <Check size={15} /> Same worldwide marketplace. One more way to express
        your interest.
      </div>
    </div>
  );
}
