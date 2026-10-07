"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  MoreHorizontal,
  Paperclip,
  Search,
  Send,
} from "lucide-react";
import { conversations, employerConversations } from "@/data/fixtures";
import { ROUTES } from "@/config/product";
import { AppLayout, Avatar, Badge, cx, PageHeading } from "@/components/shared";

export function MessagesPage({ employer = false }: { employer?: boolean }) {
  const inbox = employer ? employerConversations : conversations;
  const [selected, setSelected] = useState(inbox[0].id);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState(
    employer
      ? "Thanks for sharing your availability. Thursday works well. I will send over the interview details."
      : "Thank you, Emma. Thursday at 9:00 AM Eastern works well for me. I look forward to learning more about the team.",
  );
  const [replies, setReplies] = useState<Record<string, string[]>>({});
  const current =
    inbox.find((conversation) => conversation.id === selected) ?? inbox[0];
  const matched = inbox.filter((conversation) =>
    [conversation.name, conversation.company, conversation.role]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const displayed = matched.length ? matched : inbox;
  return (
    <AppLayout>
      <PageHeading
        eyebrow="YOUR CONVERSATIONS"
        title="Good conversations move things forward."
        text="Keep introductions, questions, and next steps in one place."
      />
      <div className="messages-layout">
        <aside className="conversation-list">
          <div className="conversation-search">
            <Search size={17} />
            <input
              aria-label="Search messages"
              value={query}
              placeholder="Search a person or company"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="conversation-label">
            <strong>Inbox</strong>
            <Badge>3 conversations</Badge>
          </div>
          {displayed.map((conversation, index) => (
            <button
              className={cx(
                "conversation-item",
                selected === conversation.id && "active",
              )}
              key={conversation.id}
              onClick={() => {
                setSelected(conversation.id);
                setDraft(
                  employer
                    ? `Thanks, ${conversation.name.split(" ")[0]}. Your experience looks relevant to our team. Let's discuss the role and working schedule this week.`
                    : `Thank you for the update. I am available to discuss the ${conversation.role.toLowerCase()} role this week.`,
                );
              }}
            >
              <Avatar
                name={conversation.name}
                tone={["purple", "blue", "coral"][index]}
              />
              <span>
                <span className="conversation-item-title">
                  <strong>{conversation.name}</strong>
                  <time>{conversation.time}</time>
                </span>
                <small>{conversation.company}</small>
                <p>{conversation.messages.at(-1)?.text}</p>
              </span>
              {conversation.unread > 0 && <b>{conversation.unread}</b>}
            </button>
          ))}
        </aside>
        <section className="conversation-panel">
          <header className="conversation-header">
            <Avatar name={current.name} tone="purple" />
            <div>
              <h2>{current.name}</h2>
              <p>
                {current.company} <span>·</span> {current.role}
              </p>
            </div>
            <Link
              className="icon-button"
              href={
                employer ? ROUTES.talent : ROUTES.job("executive-assistant")
              }
              aria-label="View profile or role"
            >
              <MoreHorizontal size={20} />
            </Link>
          </header>
          <div className="message-scroll">
            <span className="message-date">October 7, 2026</span>
            {current.messages.map((message, index) => (
              <div
                className={cx(
                  "message-item",
                  message.sender === "You" && "outgoing",
                )}
                key={index}
              >
                {message.sender !== "You" && (
                  <Avatar name={message.sender} tone="purple" />
                )}
                <div>
                  <p>{message.text}</p>
                  <small>
                    {message.sender} · {message.time}
                  </small>
                </div>
              </div>
            ))}
            <div className="message-attachment">
              <FileText size={22} />
              <div>
                <strong>
                  {employer ? current.name.replaceAll(" ", "-") : "Ana-Mendoza"}
                  -Portfolio.pdf
                </strong>
                <span>2.4 MB · Shared in conversation</span>
              </div>
            </div>
            {replies[selected]?.map((reply, index) => (
              <div className="message-item outgoing" key={index}>
                <div>
                  <p>{reply}</p>
                  <small>You · Just now</small>
                </div>
              </div>
            ))}
          </div>
          <form
            className="message-compose"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              setReplies((previous) => ({
                ...previous,
                [selected]: [
                  ...(previous[selected] ?? []),
                  draft ||
                    "Thank you for the update. I look forward to our conversation.",
                ],
              }));
              setDraft(
                "Happy to share any additional details ahead of the interview.",
              );
            }}
          >
            <textarea
              aria-label="Your message"
              placeholder="Write a thoughtful reply…"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <div>
              <span>
                <Paperclip size={17} />
                Keep work samples ready to share
              </span>
              <button className="button">
                Send message <Send size={16} />
              </button>
            </div>
          </form>
        </section>
      </div>
    </AppLayout>
  );
}
