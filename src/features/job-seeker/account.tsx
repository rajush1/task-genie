"use client";

import { useState } from "react";
import { ArrowDownToLine, Check, ShieldCheck, Wallet } from "lucide-react";
import {
  AppLayout,
  Badge,
  Metric,
  Notice,
  PageHeading,
  TextField,
} from "@/components/shared";

export function Payments() {
  const [notice, setNotice] = useState(false);
  return (
    <AppLayout>
      <PageHeading
        eyebrow="PAYMENTS & RECORDS"
        title="Your work. Your earnings."
        text="Keep track of the payment arrangements and records you share with your employer."
        action={
          <button className="button secondary" onClick={() => setNotice(true)}>
            <ArrowDownToLine size={16} />
            Export statement
          </button>
        }
      />
      {notice && (
        <Notice>Your October payment statement is ready to review.</Notice>
      )}
      <div className="metrics-grid">
        <Metric
          label="Paid this month"
          value="$1,200.00"
          change="Northstar Commerce · October"
        />
        <Metric
          label="Last payment"
          value="October 1"
          change="Monthly payment received"
        />
        <Metric
          label="Next expected"
          value="November 1"
          change="$1,200.00 · Monthly agreement"
        />
      </div>
      <div className="account-grid">
        <section className="card payment-method">
          <span className="feature-icon">
            <Wallet size={24} />
          </span>
          <h2>Payment arrangement</h2>
          <p>Payments are agreed directly with your employer.</p>
          <div className="method-detail">
            <span className="paypal-wordmark">PayPal</span>
            <div>
              <strong>ana.mendoza@outlook.com</strong>
              <small>Preferred account · USD</small>
            </div>
            <Badge>
              <Check size={13} />
              Confirmed
            </Badge>
          </div>
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              setNotice(true);
            }}
          >
            <TextField
              label="Payment account email"
              defaultValue="ana.mendoza@outlook.com"
            />
            <button className="button secondary">Update details</button>
          </form>
        </section>
        <section className="card agreement-card">
          <ShieldCheck className="teal" size={24} />
          <h2>Your working agreement</h2>
          <dl>
            <div>
              <dt>Employer</dt>
              <dd>Northstar Commerce</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>Executive Assistant</dd>
            </div>
            <div>
              <dt>Monthly compensation</dt>
              <dd>$1,200.00 USD</dd>
            </div>
            <div>
              <dt>Payment schedule</dt>
              <dd>First working day of each month</dd>
            </div>
            <div>
              <dt>Method</dt>
              <dd>PayPal transfer</dd>
            </div>
          </dl>
        </section>
      </div>
      <div className="table-card">
        <div className="table-title">
          <h2>Payment history</h2>
          <Badge tone="neutral">2026</Badge>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Period</th>
                <th>Employer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {["October", "September", "August", "July"].map((month) => (
                <tr key={month}>
                  <td>{month} 2026</td>
                  <td>Northstar Commerce</td>
                  <td>{month.slice(0, 3)} 1, 2026</td>
                  <td className="strong">$1,200.00</td>
                  <td>
                    <Badge>Received</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

export function SettingsPage({ employer = false }: { employer?: boolean }) {
  const [saved, setSaved] = useState(false);
  return (
    <AppLayout>
      <PageHeading
        eyebrow="ACCOUNT SETTINGS"
        title="Make your workspace your own."
        text="Manage your account details, visibility, and the updates you want to receive."
      />
      {saved && <Notice>Your preferences have been updated.</Notice>}
      <form
        noValidate
        className="settings-form"
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
        }}
      >
        <section className="form-card">
          <div className="form-section-heading">
            <h2>
              {employer ? "Company & account details" : "Personal details"}
            </h2>
            <p>Keep your information current and your conversations easy.</p>
          </div>
          <div className="form-grid">
            <TextField
              label="First name"
              defaultValue={employer ? "Emma" : "Ana"}
            />
            <TextField
              label="Last name"
              defaultValue={employer ? "Wilson" : "Mendoza"}
            />
            <TextField
              label="Email address"
              defaultValue={
                employer
                  ? "emma@northstarcommerce.com"
                  : "ana.mendoza@outlook.com"
              }
            />
            <TextField
              label={employer ? "Company name" : "Location"}
              defaultValue={employer ? "Northstar Commerce" : "Toronto, Canada"}
            />
            {employer && (
              <TextField
                label="Company location"
                defaultValue="New York, United States"
                placeholder="City, country or region"
              />
            )}
            <TextField
              label="Country or region"
              defaultValue={employer ? "United States" : "Canada"}
              placeholder="e.g. United States, India, or Brazil"
            />
            <TextField
              label="Time zone"
              defaultValue={employer ? "America/New_York" : "America/Toronto"}
              placeholder="e.g. Europe/London"
            />
            <TextField
              label="Preferred currency"
              defaultValue="USD"
              placeholder="e.g. USD, EUR, or INR"
            />
          </div>
          {employer && (
            <TextField
              label="Company website"
              defaultValue="https://northstarcommerce.com"
            />
          )}
        </section>
        <section className="form-card">
          <div className="form-section-heading">
            <h2>Privacy & notifications</h2>
            <p>Your profile, your preferences.</p>
          </div>
          {[
            {
              title: employer ? "Show company profile" : "Visible to employers",
              text: employer
                ? "Candidates can review your company information."
                : "Verified employers can find your profile in talent search.",
              checked: true,
            },
            {
              title: "Show activity status",
              text: "Display a recent activity window on your profile.",
              checked: true,
            },
            {
              title: "Messages & application updates",
              text: "Receive updates when a conversation or application moves forward.",
              checked: true,
            },
            {
              title: "Relevant job recommendations",
              text: "A weekly collection of roles that match your skills.",
              checked: true,
            },
          ].map((item) => (
            <label className="toggle-row" key={item.title}>
              <span>
                <strong>{item.title}</strong>
                <small>{item.text}</small>
              </span>
              <input type="checkbox" defaultChecked={item.checked} />
            </label>
          ))}
        </section>
        <section className="form-card">
          <div className="form-section-heading">
            <h2>Account security</h2>
            <p>Review your sign-in preferences.</p>
          </div>
          <div className="form-grid">
            <TextField
              label="Current password"
              type="password"
              defaultValue="RemoteWork2026"
              placeholder="Current password"
            />
            <TextField
              label="New password"
              type="password"
              defaultValue="BetterWork2026"
              placeholder="New password"
            />
          </div>
        </section>
        <div className="form-actions">
          <span className="quiet-note">Last updated October 7, 2026</span>
          <button className="button">
            Save preferences <Check size={16} />
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
