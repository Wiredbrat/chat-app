# Nimbus — Chat App Frontend

A production-ready, responsive chat UI built with React 18 and Vite. No CSS
framework or component library — a small custom design system (CSS variables
in `src/index.css`) keeps the bundle light and the look intentional.

## Features

- Conversation list with search/filter and unread badges
- Message thread with grouped avatars, timestamps, and a typing indicator
- Simulated replies (see `src/hooks/useChat.js`) so the UI is interactive
  out of the box, with no backend required
- Responsive: sidebar becomes an off-canvas drawer under 820px
- Accessible: visible focus states, `aria-label`s on icon buttons,
  `prefers-reduced-motion` respected
- Auto-resizing message input, Enter to send / Shift+Enter for a newline

## Getting started

```bash
npm install
npm run dev       # start local dev server at http://localhost:5173
npm run build     # production build -> dist/
npm run preview   # preview the production build locally
npm run lint      # run ESLint
```

Requires Node.js 18+.

## Project structure

```
src/
├── components/
│   ├── Avatar.jsx        # circular avatar with online-status dot
│   ├── ChatWindow.jsx     # header + message list + composer for one thread
│   ├── Composer.jsx       # message input (auto-resize, send on Enter)
│   ├── Icons.jsx          # small inline SVG icon set (no icon dependency)
│   ├── MessageBubble.jsx  # single message bubble, memoized
│   └── Sidebar.jsx        # conversation list + search + new-chat button
├── data/
│   └── mockData.js        # seed conversations + canned replies
├── hooks/
│   └── useChat.js         # all chat state: selection, sending, replies
├── App.jsx                # wires Sidebar + ChatWindow together
├── index.css               # design tokens + all component styles
└── main.jsx                # React root
```

## Design system

Tokens live at the top of `src/index.css` as CSS custom properties:
`--color-*` for the palette (warm off-white surface, deep teal accent),
`--font-display` / `--font-body` for type (Sora for headings, Inter for
body), and `--radius-*` / `--shadow-*` for consistent corners and elevation.
Change a token once and it propagates through every component — there's no
per-component color literal to hunt down.

## Connecting a backend

The UI is fully decoupled from data. To wire it to a real API or WebSocket:

1. Replace the static import in `src/hooks/useChat.js` (`conversations` from
   `mockData.js`) with a `fetch`/`useEffect` call that loads conversations
   on mount.
2. In `sendMessage`, replace the `setTimeout` simulated-reply block with your
   API call or socket emit, then append the real response the same way the
   mock reply is appended.
3. Message and conversation shapes to preserve:

   ```ts
   type Message = { id: string; from: 'me' | 'them'; text: string; time: string };
   type Conversation = {
     id: string; name: string; initials: string;
     online: boolean; unread: number; messages: Message[];
   };
   ```

## Performance notes

- `MessageBubble` is wrapped in `React.memo` since message lists can grow
  long and re-render frequently as new messages arrive.
- Conversation filtering and the active-conversation lookup are memoized
  with `useMemo` in `useChat.js`.
- Vite's production build (`npm run build`) tree-shakes and minifies via
  esbuild; there are no runtime CSS-in-JS costs since styling is plain CSS.
