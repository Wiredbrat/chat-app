// Seed data. Swap this module out for real API calls when wiring a backend —
// see README "Connecting a backend" for the expected shape.

export const conversations = [
  {
    id: 'c1',
    name: 'Maya Chen',
    initials: 'MC',
    online: true,
    unread: 2,
    messages: [
      { id: 'm1', from: 'them', text: 'Hey! Did you get a chance to look at the design draft?', time: '09:12' },
      { id: 'm2', from: 'me', text: 'Just opened it now, looks really clean 👌', time: '09:14' },
      { id: 'm3', from: 'them', text: 'Great — let me know if the spacing on the header feels off to you.', time: '09:15' },
    ],
  },
  {
    id: 'c2',
    name: 'Design Team',
    initials: 'DT',
    online: false,
    unread: 0,
    messages: [
      { id: 'm1', from: 'them', text: 'Standup notes are in the doc, take a look before tomorrow.', time: 'Yesterday' },
      { id: 'm2', from: 'me', text: 'Will do, thanks for posting these.', time: 'Yesterday' },
    ],
  },
  {
    id: 'c3',
    name: 'Arjun Patel',
    initials: 'AP',
    online: true,
    unread: 0,
    messages: [
      { id: 'm1', from: 'them', text: 'Lunch tomorrow?', time: 'Mon' },
      { id: 'm2', from: 'me', text: 'Sounds good, 1pm?', time: 'Mon' },
      { id: 'm3', from: 'them', text: 'Perfect, see you then.', time: 'Mon' },
    ],
  },
  {
    id: 'c4',
    name: 'Priya Nair',
    initials: 'PN',
    online: false,
    unread: 0,
    messages: [{ id: 'm1', from: 'them', text: 'Thanks for the quick turnaround!', time: 'Sun' }],
  },
];

// Canned replies used to simulate a response when the user sends a message.
export const canned = [
  "Got it, thanks for the update!",
  "Sounds good to me.",
  "Let me check and get back to you shortly.",
  "That works — appreciate you flagging it.",
  "Interesting, tell me more.",
];
