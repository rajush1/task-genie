"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Headphones,
  Megaphone,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import { ROUTES } from "@/config/product";

const enquiryUrl = "https://www.spacecrewhq.com/signup";

const services = [
  {
    icon: BriefcaseBusiness,
    label: "OPERATIONS",
    title: "Keep the essentials moving.",
    text: "Get dependable support for scheduling, research, documentation, and day-to-day coordination.",
    examples: "Executive assistance · Data services",
  },
  {
    icon: Headphones,
    label: "CUSTOMER EXPERIENCE",
    title: "Be there for your customers.",
    text: "Build a more responsive support operation across email, chat, and customer follow-ups.",
    examples: "Customer support · Inbox management",
  },
  {
    icon: Megaphone,
    label: "GROWTH",
    title: "Make room to grow.",
    text: "Bring in help for campaign coordination, social content, prospect research, and CRM follow-through.",
    examples: "Marketing assistance · B2B sales support",
  },
  {
    icon: ShoppingBag,
    label: "COMMERCE & SYSTEMS",
    title: "Connect the moving parts.",
    text: "Support store operations, product information, reporting, and the workflows behind them.",
    examples: "E-commerce assistance · Systems support",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell us what needs to move.",
    text: "Share your goals, the work to be done, and the schedule your team needs.",
  },
  {
    number: "02",
    title: "Meet a considered match.",
    text: "SpaceCrew identifies professionals suited to the role and helps shape the right setup.",
  },
  {
    number: "03",
    title: "Work with ongoing support.",
    text: "Start with a clear plan while SpaceCrew helps coordinate and manage the service.",
  },
];

export function SpaceCrewPage() {
  return (
    <div className="spacecrew-page">
      <section className="spacecrew-hero">
        <div className="container spacecrew-hero-grid">
          <div className="spacecrew-hero-copy">
            <span className="spacecrew-brand">
              <Sparkles size={18} aria-hidden="true" />
              SpaceCrew<span>®</span>
              <small>BY TASK GENIE INC.</small>
            </span>
            <span className="spacecrew-kicker">
              A MORE HANDS-ON WAY TO HIRE
            </span>
            <h1>
              Your work moves forward.
              <br />
              <em>We handle the crew.</em>
            </h1>
            <p>
              Need a virtual assistant and a team to help make the relationship
              work? SpaceCrew recruits, staffs, and manages handpicked remote
              professionals around your business needs.
            </p>
            <div className="spacecrew-hero-actions">
              <a className="button spacecrew-primary" href={enquiryUrl}>
                Talk to SpaceCrew <ArrowUpRight size={18} />
              </a>
              <a className="spacecrew-quiet-link" href="#spacecrew-services">
                Explore managed support <ArrowRight size={17} />
              </a>
            </div>
            <div className="spacecrew-hero-note">
              <ShieldCheck size={17} aria-hidden="true" />A managed service from
              the company behind Task Genie.
            </div>
          </div>
          <div
            className="spacecrew-hero-art"
            aria-label="The SpaceCrew managed service path"
          >
            <div className="spacecrew-orbit spacecrew-orbit-one" />
            <div className="spacecrew-orbit spacecrew-orbit-two" />
            <div className="spacecrew-path-card">
              <div className="spacecrew-path-top">
                <span className="spacecrew-path-symbol">
                  <Sparkles size={21} aria-hidden="true" />
                </span>
                <div>
                    <small>THE SPACECREW APPROACH</small>
                  <strong>One partner. A stronger team.</strong>
                </div>
              </div>
              <div className="spacecrew-path-row">
                <span>01</span>
                <div>
                  <strong>Define the work</strong>
                  <small>We learn your priorities and working rhythm.</small>
                </div>
                <Check size={17} aria-hidden="true" />
              </div>
              <div className="spacecrew-path-row">
                <span>02</span>
                <div>
                  <strong>Find your person</strong>
                  <small>Handpicked talent for the role you need.</small>
                </div>
                <Check size={17} aria-hidden="true" />
              </div>
              <div className="spacecrew-path-row">
                <span>03</span>
                <div>
                  <strong>Keep work on course</strong>
                  <small>Ongoing coordination as your needs evolve.</small>
                </div>
                <Check size={17} aria-hidden="true" />
              </div>
            </div>
            <div className="spacecrew-art-chip spacecrew-art-chip-one">
              <Users size={15} aria-hidden="true" /> Handpicked talent
            </div>
            <div className="spacecrew-art-chip spacecrew-art-chip-two">
              <Workflow size={15} aria-hidden="true" /> Managed support
            </div>
          </div>
        </div>
      </section>

      <section
        className="spacecrew-intro container"
        aria-label="What makes SpaceCrew different"
      >
        <div>
          <span className="spacecrew-intro-icon">
            <Users size={22} aria-hidden="true" />
          </span>
          <strong>People chosen for your work</strong>
          <p>
            A thoughtful match based on the responsibilities and skills you
            need.
          </p>
        </div>
        <div>
          <span className="spacecrew-intro-icon">
            <Workflow size={22} aria-hidden="true" />
          </span>
          <strong>A team behind the teammate</strong>
          <p>
            Recruiting, staffing, and management through one service partner.
          </p>
        </div>
        <div>
          <span className="spacecrew-intro-icon">
            <MessageCircle size={22} aria-hidden="true" />
          </span>
          <strong>Built around your business</strong>
          <p>
            Discuss the work, schedule, and support model before getting
            started.
          </p>
        </div>
      </section>

      <section className="spacecrew-section container" id="spacecrew-services">
        <div className="spacecrew-section-head">
          <div>
            <span className="eyebrow">SUPPORT THAT FITS THE WORK</span>
            <h2>Room for your team to do more.</h2>
            <p>
              From the daily essentials to specialist workflows, SpaceCrew helps
              you build the support your business actually needs.
            </p>
          </div>
          <a href="https://www.spacecrewhq.com/services" className="text-link">
            See all SpaceCrew services <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="spacecrew-services-grid">
          {services.map(({ icon: Icon, label, title, text, examples }) => (
            <article className="spacecrew-service-card" key={label}>
              <span className="spacecrew-service-icon">
                <Icon size={25} aria-hidden="true" />
              </span>
              <small>{label}</small>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="spacecrew-examples">{examples}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="spacecrew-choice">
        <div className="container">
          <div className="spacecrew-choice-heading">
            <span className="eyebrow">TWO WAYS TO BUILD YOUR TEAM</span>
            <h2>Choose how hands-on you want to be.</h2>
            <p>
              Task Genie and SpaceCrew are two ways to work with remote talent
              from the same company.
            </p>
          </div>
          <div className="spacecrew-choice-grid">
            <article className="spacecrew-choice-card">
              <span className="spacecrew-choice-icon">
                <BriefcaseBusiness size={22} aria-hidden="true" />
              </span>
              <small>SELF-SERVICE MARKETPLACE</small>
              <h3>Task Genie</h3>
              <p>
                Want to lead the search yourself? Post a role, connect with
                professionals, and agree on a direct working relationship.
              </p>
              <ul>
                <li>
                  <Check size={16} aria-hidden="true" /> You post and manage the
                  role
                </li>
                <li>
                  <Check size={16} aria-hidden="true" /> You choose and contract
                  with the professional
                </li>
                <li>
                  <Check size={16} aria-hidden="true" /> You manage the work
                  directly
                </li>
              </ul>
              <Link className="text-link" href={ROUTES.talent}>
                Explore the marketplace <ArrowRight size={16} />
              </Link>
            </article>
            <article className="spacecrew-choice-card is-managed">
              <span className="spacecrew-choice-icon">
                <Sparkles size={22} aria-hidden="true" />
              </span>
              <small>MANAGED VIRTUAL ASSISTANT SERVICE</small>
              <h3>SpaceCrew</h3>
              <p>
                Want a partner alongside you? SpaceCrew helps recruit, staff,
                and manage selected assistants for your business.
              </p>
              <ul>
                <li>
                  <Check size={16} aria-hidden="true" /> Discuss the work with a
                  service team
                </li>
                <li>
                  <Check size={16} aria-hidden="true" /> Meet handpicked support
                </li>
                <li>
                  <Check size={16} aria-hidden="true" /> Get ongoing management
                </li>
              </ul>
              <a className="text-link" href={enquiryUrl}>
                Discuss managed support <ArrowUpRight size={16} />
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="spacecrew-section container spacecrew-process">
        <div className="spacecrew-section-head">
          <div>
            <span className="eyebrow">A CLEAR PATH FORWARD</span>
            <h2>Start with a conversation.</h2>
            <p>
              No complicated setup on Task Genie. Tell SpaceCrew what your team
              needs and work through the right fit together.
            </p>
          </div>
        </div>
        <div className="spacecrew-step-grid">
          {steps.map((step) => (
            <article key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container spacecrew-final-wrap">
        <div className="spacecrew-final">
          <span className="eyebrow">WHEN YOU NEED MORE THAN A JOB POST</span>
          <h2>Build your crew. Keep your focus.</h2>
          <p>
            Talk through the role, the skills, and the way you want your team to
            work.
          </p>
          <div>
            <a className="button" href={enquiryUrl}>
              Talk to SpaceCrew <ArrowUpRight size={18} />
            </a>
            <a
              href="https://www.spacecrewhq.com/"
              className="spacecrew-quiet-link"
            >
              Visit SpaceCrewHQ <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
