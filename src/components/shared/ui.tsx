"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight, Check, MapPin } from "lucide-react";

export const cx = (...values: (string | false | undefined)[]) =>
  values.filter(Boolean).join(" ");

export function Avatar({
  name,
  tone = "green",
  large = false,
}: {
  name: string;
  tone?: string;
  large?: boolean;
}) {
  return (
    <span
      className={cx("avatar", `tone-${tone}`, large && "avatar-lg")}
      aria-hidden="true"
    >
      {name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}

export function PageHeading({
  eyebrow,
  title,
  text,
  action,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
      {action && <div className="heading-action">{action}</div>}
    </div>
  );
}

export function SectionHeading({
  title,
  text,
  action,
}: {
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {action}
    </div>
  );
}

export function Metric({
  label,
  value,
  change,
  icon,
}: {
  label: string;
  value: string | number;
  change: string;
  icon?: ReactNode;
}) {
  return (
    <article className="metric-card">
      <div className="metric-label">
        {label}
        {icon}
      </div>
      <strong>{value}</strong>
      <span>{change}</span>
    </article>
  );
}

export function TextField({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="field-label">
      {label}
      <input
        placeholder={
          typeof props.defaultValue === "string" ? props.defaultValue : label
        }
        {...props}
      />
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function Notice({
  children,
  tone = "green",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return (
    <div className={cx("notice", `notice-${tone}`)}>
      <Check size={17} />
      <span>{children}</span>
    </div>
  );
}

export function Centered({ children }: { children: ReactNode }) {
  return <div className="centered">{children}</div>;
}

export function Location({ children }: { children: ReactNode }) {
  return (
    <span className="inline-meta">
      <MapPin size={14} />
      {children}
    </span>
  );
}

export function SkillTags({ skills }: { skills: string[] }) {
  return (
    <div className="tags">
      {skills.map((skill) => (
        <span key={skill}>{skill}</span>
      ))}
    </div>
  );
}

export function Badge({
  children,
  tone = "green",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return <span className={cx("badge", `badge-${tone}`)}>{children}</span>;
}

export function AppLayout({
  children,
}: {
  children: ReactNode;
  active?: string;
}) {
  return <div className="workspace-content">{children}</div>;
}

export function PortfolioTiles({ items }: { items: string[] }) {
  return (
    <div className="portfolio-grid">
      {items.map((item, index) => (
        <div
          className={cx(
            "portfolio-tile",
            index % 2 === 1 && "portfolio-tile-alt",
          )}
          key={item}
        >
          <div>
            <span>0{index + 1}</span>
            <ArrowUpRight size={16} />
          </div>
          <strong>{item}</strong>
          <small>Case study · 2026</small>
        </div>
      ))}
    </div>
  );
}
