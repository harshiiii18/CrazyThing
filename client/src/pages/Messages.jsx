import { useState } from "react";
import { Search, Send, MoreVertical, Circle, Check, CheckCheck } from "lucide-react";

const conversations = [
  {
    id: 1,
    name: "Aarav Mehta",
    lastMessage: "Sure, I can hold it for you till tomorrow.",
    time: "2m",
    unread: 2,
    online: true,
    productTitle: "Apple iPhone 13 128GB",
    productPrice: "₹32,999",
    productImage:
      "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=100&q=80",
  },
  {
    id: 2,
    name: "Priya Sharma",
    lastMessage: "Is the price negotiable?",
    time: "1h",
    unread: 0,
    online: false,
    productTitle: "Sony WH-1000XM4 Headphones",
    productPrice: "₹14,500",
    productImage:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=100&q=80",
  },
  {
    id: 3,
    name: "Rohit Kumar",
    lastMessage: "You: Sounds good, see you then!",
    time: "1d",
    unread: 0,
    online: true,
    productTitle: "Herman Miller Aeron Chair",
    productPrice: "₹28,000",
    productImage:
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=100&q=80",
  },
];

const mockMessages = [
  { id: 1, fromMe: false, text: "Hey! Is this still available?", time: "10:02 AM" },
  { id: 2, fromMe: true, text: "Yes, it is! Are you interested?", time: "10:05 AM" },
  { id: 3, fromMe: false, text: "Yes, would you take ₹30,000 for it?", time: "10:07 AM" },
  { id: 4, fromMe: true, text: "I can do ₹31,500, final price.", time: "10:09 AM" },
  { id: 5, fromMe: false, text: "Sure, I can hold it for you till tomorrow.", time: "10:12 AM" },
];

export default function Messages() {
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [draft, setDraft] = useState("");

  const active = conversations.find((c) => c.id === activeId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink_text-hi">Messages</h1>

      <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-line md:grid-cols-[320px_1fr]">
        {/* Conversation list */}
        <div className="border-b border-line bg-surface md:border-b-0 md:border-r">
          <div className="border-b border-line p-3">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink_text-low" />
              <input
                placeholder="Search conversations…"
                className="w-full rounded-full border border-line bg-ink py-2.5 pl-9 pr-3 text-sm text-ink_text-hi placeholder:text-ink_text-low outline-none focus:border-ember"
              />
            </div>
          </div>

          <div className="max-h-[520px] overflow-y-auto">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`flex w-full items-start gap-3 border-b border-line/60 p-3.5 text-left transition-colors ${
                  activeId === c.id ? "bg-ember/10" : "hover:bg-surface-raised"
                }`}
              >
                <div className="relative shrink-0">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-raised text-sm font-medium text-ink_text-hi">
                    {c.name[0]}
                  </div>
                  {c.online && (
                    <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-surface bg-signal-green" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-ink_text-hi">{c.name}</p>
                    <span className="shrink-0 text-[11px] text-ink_text-low">{c.time}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-ink_text-mid">{c.lastMessage}</p>
                  <p className="mt-1 truncate text-[11px] text-ink_text-low">{c.productTitle}</p>
                </div>
                {c.unread > 0 && (
                  <span className="mt-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-ember px-1.5 text-[11px] font-bold text-ink">
                    {c.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div className="flex min-h-[500px] flex-col bg-ink">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-raised text-sm font-medium text-ink_text-hi">
                  {active.name[0]}
                </div>
                {active.online && (
                  <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-signal-green" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-ink_text-hi">{active.name}</p>
                <p className="flex items-center gap-1 text-[11px] text-ink_text-low">
                  <Circle size={6} className={active.online ? "fill-signal-green text-signal-green" : "fill-ink_text-low text-ink_text-low"} />
                  {active.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <button className="rounded-full p-2 text-ink_text-mid hover:bg-surface-raised">
              <MoreVertical size={17} />
            </button>
          </div>

          {/* Product context strip */}
          <div className="flex items-center gap-3 border-b border-line bg-surface/50 px-4 py-2.5">
            <img src={active.productImage} alt="" className="h-9 w-9 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-ink_text-hi">{active.productTitle}</p>
            </div>
            <span className="font-mono text-xs text-ember-soft">{active.productPrice}</span>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {mockMessages.map((m) => (
              <div key={m.id} className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.fromMe
                      ? "rounded-br-sm bg-ember text-ink"
                      : "rounded-bl-sm border border-line bg-surface text-ink_text-hi"
                  }`}
                >
                  <p>{m.text}</p>
                  <div
                    className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                      m.fromMe ? "text-ink/70" : "text-ink_text-low"
                    }`}
                  >
                    {m.time}
                    {m.fromMe && <CheckCheck size={12} />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Composer — UI only, not wired to a backend yet */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDraft("");
            }}
            className="flex items-center gap-2 border-t border-line bg-surface p-3"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message…"
              className="w-full rounded-full border border-line bg-ink px-4 py-2.5 text-sm text-ink_text-hi placeholder:text-ink_text-low outline-none focus:border-ember"
            />
            <button
              type="submit"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ember text-ink transition-transform hover:scale-105"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-ink_text-low">
        This is a preview of the messaging UI — real-time chat is coming in a future update.
      </p>
    </div>
  );
}