"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDownToLine, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { invoices } from "@/data/fixtures";
import { ROUTES } from "@/config/product";
import {
  AppLayout,
  Badge,
  Notice,
  PageHeading,
  TextField,
} from "@/components/shared";

export function BillingPage() {
  const [checkout, setCheckout] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [notice, setNotice] = useState("");
  return (
    <AppLayout>
      <PageHeading
        eyebrow="BILLING & SUBSCRIPTION"
        title="A plan for your next great hire."
        text="Review your hiring plan, billing details, and payment records."
        action={
          <Link className="button secondary" href={ROUTES.pricing}>
            Compare plans <ArrowRight size={15} />
          </Link>
        }
      />
      {notice && <Notice>{notice}</Notice>}
      <div className="billing-grid">
        <section className="card current-plan">
          <span className="eyebrow">CURRENT PLAN</span>
          <div>
            <h2>{confirmed ? "Team" : "Pro"}</h2>
            <Badge>Active</Badge>
          </div>
          <p>
            Everything you need to find, contact, and hire your next teammate.
          </p>
          <div className="plan-price">
            ${confirmed ? "99" : "69"}
            <span> / month</span>
          </div>
          <div className="plan-features">
            <span>
              <Check size={15} />
              {confirmed ? "10" : "3"} active job posts
            </span>
            <span>
              <Check size={15} />
              Contact {confirmed ? "500" : "75"} candidates / month
            </span>
            <span>
              <Check size={15} />
              Full profiles & hiring pipeline
            </span>
          </div>
          <div className="usage-meter">
            <span>
              Candidate contacts <b>18 / {confirmed ? "500" : "75"}</b>
            </span>
            <div className="meter">
              <span style={{ width: confirmed ? "4%" : "24%" }} />
            </div>
          </div>
          <button className="button" onClick={() => setCheckout(true)}>
            Explore Team plan <ArrowRight size={16} />
          </button>
          <small>Next renewal: November 1, 2026</small>
        </section>
        <section className="card billing-method">
          <h2>Payment method</h2>
          <div className="paypal-method">
            <span className="paypal-wordmark">PayPal</span>
            <Badge>Connected</Badge>
          </div>
          <strong>billing@northstarcommerce.com</strong>
          <p>Payments in USD · Monthly billing</p>
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              setNotice("Billing details have been updated.");
            }}
          >
            <TextField
              label="Billing name"
              defaultValue="Northstar Commerce LLC"
            />
            <TextField
              label="Billing email"
              defaultValue="billing@northstarcommerce.com"
            />
            <TextField
              label="Billing address"
              defaultValue="Austin, Texas, United States"
            />
            <button className="button secondary full">
              Update billing details
            </button>
          </form>
          <p className="quiet-note">
            <ShieldCheck size={14} />
            Payment details stay private.
          </p>
        </section>
      </div>
      <div className="table-card">
        <div className="table-title">
          <h2>Billing history</h2>
          <Badge tone="neutral">Last 3 months</Badge>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="strong">{invoice.id}</td>
                  <td>{invoice.date}</td>
                  <td>{invoice.description}</td>
                  <td>{invoice.amount}</td>
                  <td>
                    <Badge>{invoice.status}</Badge>
                  </td>
                  <td>
                    <button
                      className="icon-button"
                      aria-label={`Review invoice ${invoice.id}`}
                      onClick={() =>
                        setNotice(
                          `Invoice ${invoice.id} · ${invoice.description} · ${invoice.amount} · Paid`,
                        )
                      }
                    >
                      <ArrowDownToLine size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {checkout && (
        <div className="modal-overlay">
          <div
            className="checkout-modal card"
            role="dialog"
            aria-modal="true"
            aria-label="Plan selection"
          >
            <span className="eyebrow">REVIEW YOUR PLAN</span>
            <h2>A little more room to hire.</h2>
            <p>
              Team adds capacity for multiple roles and a shared recruiting
              process.
            </p>
            <div className="checkout-summary">
              <span>Team · Monthly subscription</span>
              <strong>$99.00 / month</strong>
              <span>Payment method</span>
              <strong>PayPal · Connected</strong>
            </div>
            <Badge tone="neutral">Preview checkout · No charge</Badge>
            <div className="button-row">
              <button
                className="button"
                onClick={() => {
                  setConfirmed(true);
                  setCheckout(false);
                  setNotice(
                    "The Team plan is selected in your preview workspace.",
                  );
                }}
              >
                Confirm selection <Check size={16} />
              </button>
              <button
                className="button secondary"
                onClick={() => setCheckout(false)}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
