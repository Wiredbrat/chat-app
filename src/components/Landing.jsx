import { useEffect, useRef, useState } from "react";

// Swap these for <Link to="..."> from react-router-dom if you use it.
const LOGIN_URL = "/login";
const REGISTER_URL = "/signup";

const FEATURES = [
  {
    title: "Real-time messaging",
    text: "Messages arrive the moment they’re sent, over a live WebSocket connection.",
    icon: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  },
  {
    title: "Secure authentication",
    text: "Your account is protected with signed-in sessions, so only you can read your chats.",
    icon: (
      <>
        <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: "Online / offline presence",
    text: "See who’s available before you send, and when someone was last around.",
    icon: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
        <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2.2.6 3.5 2.6 3.5 6" />
      </>
    ),
  },
  {
    title: "Multi-device support",
    text: "Start on your laptop, continue on your phone. Every device stays in sync.",
    icon: (
      <>
        <rect x="2" y="5" width="13" height="10" rx="1.5" />
        <path d="M5 19h7" />
        <rect x="17" y="8" width="5" height="11" rx="1.2" />
      </>
    ),
  },
  {
    title: "Fast loading",
    text: "Recent conversations are cached, so your chat list opens instantly.",
    icon: (
      <>
        <ellipse cx="12" cy="5.5" rx="8" ry="3" />
        <path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
      </>
    ),
  },
  {
    title: "Reliable delivery",
    text: "Messages are queued, so nothing gets lost when the connection drops.",
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2.5" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
  },
];

const STACK = ["React", "Node.js", "Express JS", "WebSockets", "Redis", "MongoDB", "BullMQ"];

const CONTACTS = [
  { name: "atulverma", preview: "how are you", time: "10:22 PM", online: true, active: true },
  { name: "goku", preview: "Tap to start a conversation" },
  { name: "taopaipai", preview: "Tap to start a conversation", online: true },
  { name: "luffy", preview: "Tap to start a conversation" },
];

const SCRIPT = [
  { from: "in", text: "hello 👋" },
  { from: "out", text: "Hey! Whats up?" },
  { from: "in", text: "working on a very cool project. will show you later." },
];
const REPLIES = ["Got it!", "Nice, that was instant.", "Create an account to chat for real."];

const now = () => {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
};

function ChatDemo() {
  const [msgs, setMsgs] = useState([]);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const box = useRef(null);
  const replyIdx = useRef(0);
  const timers = useRef([]);

  const later = (fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  };
  const push = (from, body) =>
    setMsgs((m) => [...m, { id: crypto.randomUUID(), from, body, time: now() }]);
  const reply = (body) => {
    setTyping(true);
    later(() => {
      setTyping(false);
      push("in", body);
    }, 900);
  };

  // Opening conversation plays once on mount.
  useEffect(() => {
    let i = 0;
    const step = () => {
      if (i >= SCRIPT.length) return;
      const { from, text } = SCRIPT[i++];
      if (from === "in") {
        setTyping(true);
        later(() => {
          setTyping(false);
          push("in", text);
          later(step, 700);
        }, 900);
      } else {
        later(() => {
          push("out", text);
          later(step, 500);
        }, 600);
      }
    };
    later(step, 500);
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [msgs, typing]);

  const send = () => {
    const v = text.trim();
    if (!v) return;
    push("out", v);
    setText("");
    reply(REPLIES[replyIdx.current++ % REPLIES.length]);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    send();
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div>
      <div className="demo" role="group" aria-label="Preview of a Nimbus conversation">
        <div className="demo__sidebar">
          <div className="demo__brand">
            <span className="landing__brand-mark">N</span>
            Nimbus
          </div>
          {CONTACTS.map((c) => (
            <div
              key={c.name}
              className={`conversation${c.active ? " conversation--active" : ""}`}
            >
              <div className="avatar">
                {c.name[0].toUpperCase()}
                {c.online && <span className="avatar__status" />}
              </div>
              <div className="conversation__body">
                <div className="conversation__top">
                  <span className="conversation__name">{c.name}</span>
                  {c.time && <span className="conversation__time">{c.time}</span>}
                </div>
                <div className="conversation__preview">{c.preview}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="demo__main">
          <div className="demo__header">
            <div className="avatar">
              A<span className="avatar__status" />
            </div>
            <div>
              <div className="demo__header-name">atulverma</div>
              <div className="demo__header-status">Online</div>
            </div>
          </div>

          <div className="demo__messages" ref={box} aria-live="polite">
            {msgs.map((m) => (
              <div key={m.id} className={`msg-row msg-row--${m.from}`}>
                <div className="bubble">
                  <div className="bubble__text">{m.body}</div>
                  <span className="bubble__time">{m.time}</span>
                </div>
              </div>
            ))}
            {typing && (
              <div className="msg-row msg-row--in">
                <div className="bubble">
                  <div className="bubble__text">
                    <span className="typing-indicator">
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form className="composer" onSubmit={onSubmit}>
            <div className="composer__field">
              <textarea
                rows={1}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Write a message…"
                aria-label="Write a message"
              />
            </div>
            <button
              type="submit"
              className="composer__send"
              aria-label="Send"
              disabled={!text.trim()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
      <p className="demo__hint">This is a demo. Type a message to try it.</p>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="landing">
      <header className="landing__header">
        <div className="landing__container">
          <nav className="landing__nav">
            <a className="landing__brand" href="#top">
              <span className="landing__brand-mark">N</span>
              Nimbus
            </a>
            <div className="landing__links">
              <a href="#features">Features</a>
              <a href="#stack">How it’s built</a>
            </div>
            <div className="landing__spacer" />
            <a className="landing__btn landing__btn--hide-sm" href={LOGIN_URL}>Log in</a>
            <a className="landing__btn landing__btn--primary" href={REGISTER_URL}>Sign up</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <div className="landing__container landing__hero">
          <div>
            <h1 className="landing__title">Connect. Chat. Stay in sync.</h1>
            <p className="landing__lede">
              Nimbus is a real-time chat app that keeps every conversation current on all your
              devices, and shows you who’s online right now.
            </p>
            <div className="landing__actions">
              <a className="landing__btn landing__btn--primary landing__btn--lg" href={REGISTER_URL}>
                Create free account
              </a>
              <a className="landing__btn landing__btn--lg" href={LOGIN_URL}>Log in</a>
            </div>
            <p className="landing__note">Works in your browser and on your phone.</p>
          </div>
          <ChatDemo />
        </div>

        <section className="landing__section landing__section--surface" id="features">
          <div className="landing__container">
            <h2 className="landing__heading">Everything you need to talk, nothing you don’t</h2>
            <p className="landing__subheading">
              Sign up, find a person, and start chatting. Nimbus handles delivery, presence and
              syncing in the background.
            </p>
            <div className="features">
              {FEATURES.map((f) => (
                <div className="feature" key={f.title}>
                  <svg className="feature__icon" viewBox="0 0 24 24" aria-hidden="true">{f.icon}</svg>
                  <div>
                    <h3 className="feature__title">{f.title}</h3>
                    <p className="feature__text">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="landing__section" id="stack">
          <div className="landing__container">
            <h2 className="landing__heading">How it’s built</h2>
            <p className="landing__subheading">
              A modern JavaScript stack designed for speed and reliability.
            </p>
            <div className="stack">
              {STACK.map((s) => (
                <span className="stack__item" key={s}>{s}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="landing__section landing__section--final">
          <div className="landing__container">
            <h2 className="landing__heading">Ready to start a conversation?</h2>
            <p className="landing__subheading">Create your account in under a minute.</p>
            <div className="landing__actions">
              <a className="landing__btn landing__btn--primary landing__btn--lg" href={REGISTER_URL}>Sign up</a>
              <a className="landing__btn landing__btn--lg" href={LOGIN_URL}>Log in</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing__footer">
        <div className="landing__container">
          <span>© 2026 Nimbus</span>
          <span>Real-time chat application</span>
        </div>
      </footer>
    </div>
  );
}
