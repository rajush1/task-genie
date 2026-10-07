"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  LifeBuoy,
  MessageSquare,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { ROUTES } from "@/config/product";
import {
  cx,
  Notice,
  PageHeading,
  SectionHeading,
  TextField,
} from "@/components/shared";

const faq = [
  {
    q: "Can I find full-time and part-time work?",
    a: "Yes. Browse roles by employment type and review the weekly hours, working schedule, and compensation before you apply. Project and contract opportunities are also available.",
  },
  {
    q: "How does direct hiring work?",
    a: "Employers and professionals meet through the marketplace, discuss the role, and agree on compensation and working arrangements directly. Use the conversation to clarify responsibilities, overlap, and the first month of work.",
  },
  {
    q: "Do job seekers pay to apply?",
    a: "Browsing opportunities, creating a profile, and applying for work are free for job seekers. An employer should never ask you to pay an application fee.",
  },
  {
    q: "What should I include in my profile?",
    a: "Add a specific professional headline, relevant experience, expected pay, availability, and three to six key skills. Include a resume and work samples that show what you have delivered.",
  },
  {
    q: "What does an identity badge mean?",
    a: "An identity badge represents a completed identity check. It is one signal to consider alongside work history, portfolio quality, references, and your own interview.",
  },
  {
    q: "How do I choose a hiring plan?",
    a: "Start with the number of roles you are hiring for and how many candidates you expect to contact. Pro suits a focused search, while Team adds capacity for several roles and a shared recruiting process.",
  },
];

export function HowItWorks() {
  return (
    <div className="marketing-page">
      <section className="container marketing-hero">
        <span className="eyebrow">FROM FIRST SEARCH TO FIRST DAY</span>
        <h1>
          Good work starts with
          <br />
          <em>a good connection.</em>
        </h1>
        <p>
          Find Filipino professionals, discover remote roles, and build working
          relationships with clear expectations from day one.
        </p>
        <div className="button-row">
          <Link className="button" href={ROUTES.talent}>
            I’m hiring <Users size={17} />
          </Link>
          <Link className="button secondary" href={ROUTES.jobs}>
            I’m looking for work <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <section className="container how-grid">
        {[
          {
            name: "For employers",
            icon: Users,
            title: "Build a team that moves you forward.",
            steps: [
              {
                title: "Define the role",
                text: "Write a clear job description with responsibilities, essential skills, salary range, and working hours.",
              },
              {
                title: "Find and meet candidates",
                text: "Browse profiles or review applications. Compare relevant experience, work samples, and communication styles.",
              },
              {
                title: "Agree on the details",
                text: "Interview your shortlist, set compensation and expectations, and plan a thoughtful onboarding.",
              },
            ],
            href: ROUTES.postJob,
            cta: "Post your first role",
          },
          {
            name: "For professionals",
            icon: BriefcaseBusiness,
            title: "Find the work you want to grow with.",
            steps: [
              {
                title: "Introduce yourself",
                text: "Build a complete profile with your top skills, work experience, availability, and portfolio.",
              },
              {
                title: "Explore your options",
                text: "Search roles by skill, employment type, and schedule. Save the opportunities that fit your goals.",
              },
              {
                title: "Start the conversation",
                text: "Send a personal application, ask good questions, and agree on the terms that work for you.",
              },
            ],
            href: ROUTES.profile,
            cta: "Build your profile",
          },
        ].map(({ name, icon: Icon, title, steps, href, cta }) => (
          <article className="how-card" key={name}>
            <span className="feature-icon">
              <Icon size={23} />
            </span>
            <span className="eyebrow">{name}</span>
            <h2>{title}</h2>
            {steps.map((step, index) => (
              <div className="how-step" key={step.title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
            <Link className="button full secondary" href={href}>
              {cta}
              <ArrowRight size={16} />
            </Link>
          </article>
        ))}
      </section>
      <section className="container section">
        <SectionHeading
          title="A few things worth knowing"
          text="Straightforward answers before your first conversation."
        />
        <div className="faq-list">
          {faq.slice(0, 4).map((item) => (
            <details key={item.q}>
              <summary>
                {item.q}
                <ChevronDown size={17} />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

export function Pricing() {
  const [annual, setAnnual] = useState(false);
  const plans = [
    {
      name: "Starter",
      price: "0",
      description: "Explore the marketplace and prepare your first hire.",
      features: [
        "Browse professional profiles",
        "Create up to 3 job drafts",
        "Review candidate applications",
        "Save promising professionals",
      ],
      cta: "Start exploring",
    },
    {
      name: "Pro",
      price: annual ? "25" : "69",
      description: "Everything you need for a focused hiring search.",
      features: [
        "3 active job posts",
        "Contact 75 candidates per month",
        "Full profiles and work samples",
        "Messaging and candidate pipeline",
        "Application review workspace",
      ],
      cta: "Choose Pro",
      popular: true,
    },
    {
      name: "Team",
      price: annual ? "29" : "99",
      description: "More room to build a growing remote team.",
      features: [
        "10 active job posts",
        "Contact 500 candidates per month",
        "Everything included in Pro",
        "Shared shortlists and hiring notes",
        "Priority recruiting support",
      ],
      cta: "Choose Team",
    },
  ];
  return (
    <div className="marketing-page">
      <section className="container marketing-hero">
        <span className="eyebrow">PLANS THAT WORK AS HARD AS YOU DO</span>
        <h1>
          Your next hire.
          <br />
          <em>A straightforward plan.</em>
        </h1>
        <p>
          Tools to find and connect with the right people. Agree on salaries
          directly, with no salary markup.
        </p>
        <div className="billing-toggle">
          <button
            className={cx(!annual && "active")}
            onClick={() => setAnnual(false)}
          >
            Monthly
          </button>
          <button
            className={cx(annual && "active")}
            onClick={() => setAnnual(true)}
          >
            Annually <span>Save more</span>
          </button>
        </div>
      </section>
      <div className="container pricing-grid">
        {plans.map((plan) => (
          <article
            className={cx("price-card", plan.popular && "featured")}
            key={plan.name}
          >
            {plan.popular && (
              <span className="popular-label">
                THE MOST POPULAR WAY TO HIRE
              </span>
            )}
            <h2>{plan.name}</h2>
            <p>{plan.description}</p>
            <div className="price">
              <span>$</span>
              <strong>{plan.price}</strong>
              <small>
                {plan.name === "Starter" ? "Free to explore" : "/ month"}
              </small>
            </div>
            <span className="billing-caption">
              {plan.name === "Starter"
                ? "No card needed"
                : annual
                  ? "Billed annually"
                  : "Billed monthly. Cancel anytime."}
            </span>
            <Link
              className={cx("button full", !plan.popular && "secondary")}
              href={
                plan.name === "Starter" ? ROUTES.signup : ROUTES.employerBilling
              }
            >
              {plan.cta}
              <ArrowRight size={16} />
            </Link>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Check size={16} />
                  {feature}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="container pricing-reassurance">
        <span>
          <Wallet size={19} />
          No salary commissions
        </span>
        <span>
          <ShieldCheck size={19} />
          Secure billing
        </span>
        <span>
          <Users size={19} />
          Always free for professionals
        </span>
      </div>
      <section className="container section">
        <SectionHeading title="Good questions. Clear answers." />
        <div className="faq-list">
          {faq.slice(1).map((item) => (
            <details key={item.q}>
              <summary>
                {item.q}
                <ChevronDown size={17} />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

export function InformationPage({
  kind,
}: {
  kind: "trust" | "support" | "about";
}) {
  const [sent, setSent] = useState(false);
  const trust = kind === "trust";
  const about = kind === "about";
  return (
    <div className="container information-page">
      <PageHeading
        eyebrow={
          trust ? "TRUST & SAFETY" : about ? "OUR PURPOSE" : "HERE TO HELP"
        }
        title={
          trust
            ? "Confidence in every connection."
            : about
              ? "Better work, built together."
              : "A little guidance goes a long way."
        }
        text={
          trust
            ? "Practical tools and clear information to help you hire and work with confidence."
            : about
              ? "We connect Filipino professionals and global teams around one shared ambition: meaningful, lasting work."
              : "Explore answers, practical resources, and ways to keep your search moving."
        }
      />
      <div className="information-grid">
        {[
          {
            icon: ShieldCheck,
            title: trust
              ? "Transparent verification"
              : about
                ? "Direct connections"
                : "Account & profile",
            text: trust
              ? "Identity and company badges explain which information has been checked. Combine them with a portfolio review and a conversation."
              : about
                ? "People should be able to find each other, agree on expectations, and build a working relationship directly."
                : "Update your details, professional headline, skills, portfolio, and availability.",
            href: ROUTES.profile,
          },
          {
            icon: Wallet,
            title: trust
              ? "Safer applications"
              : about
                ? "Clear expectations"
                : "Jobs & applications",
            text: trust
              ? "Do not pay application fees or share account passwords. Keep written records of the agreed responsibilities and compensation."
              : about
                ? "Visible compensation, working hours, and role responsibilities help both sides choose with confidence."
                : "Review salaries and schedules, save roles, and track applications from your workspace.",
            href: ROUTES.jobs,
          },
          {
            icon: MessageSquare,
            title: trust
              ? "Support when you need it"
              : about
                ? "Long-term relationships"
                : "Hiring & billing",
            text: trust
              ? "Report a concern about a listing, profile, or conversation. Our support resources explain the next steps."
              : about
                ? "We focus on the work and working relationships that let people grow alongside one team."
                : "Find professional profiles, manage applications, and choose a plan for your search.",
            href: ROUTES.talent,
          },
        ].map(({ icon: Icon, title, text, href }) => (
          <article className="card information-card" key={title}>
            <span className="feature-icon">
              <Icon size={23} />
            </span>
            <h2>{title}</h2>
            <p>{text}</p>
            <Link className="text-link" href={href}>
              Explore <ArrowRight size={15} />
            </Link>
          </article>
        ))}
      </div>
      <div className="support-layout">
        <div>
          <SectionHeading
            title={
              about
                ? "Built for the way teams work."
                : "Useful answers, all in one place."
            }
          />
          <div className="faq-list">
            {faq.map((item) => (
              <details key={item.q}>
                <summary>
                  {item.q}
                  <ChevronDown size={17} />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
        <form
          className="form-card"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
        >
          <span className="feature-icon">
            <LifeBuoy size={24} />
          </span>
          <h2>{trust ? "Share a concern" : "Talk to our team"}</h2>
          <p>
            Give us a little context so we can point you in the right direction.
          </p>
          <TextField
            label="Email address"
            defaultValue="ana.mendoza@outlook.com"
          />
          <label className="field-label">
            Topic
            <select>
              <option>Profile and account</option>
              <option>Job application</option>
              <option>Report a listing</option>
              <option>Hiring and billing</option>
            </select>
          </label>
          <label className="field-label">
            Your message
            <textarea
              placeholder="Tell us how we can help."
              defaultValue="I would like guidance on highlighting my e-commerce experience and portfolio for executive assistant roles."
            />
          </label>
          <button className="button">
            Send message <ArrowRight size={16} />
          </button>
          {sent && <Notice>Your message is ready for our support team.</Notice>}
        </form>
      </div>
    </div>
  );
}
