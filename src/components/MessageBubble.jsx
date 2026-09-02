import { memo } from 'react';
import Avatar from './Avatar.jsx';

function MessageBubble({ message, initials, showAvatar }) {
  const isOut = message.from === 'me';
  return (
    <div className={`msg-row ${isOut ? 'msg-row--out' : 'msg-row--in'}`}>
      {!isOut && (showAvatar ? <Avatar initials={initials} size={26} /> : <div style={{ width: 26 }} />)}
      <div className="bubble">
        {message.text}
        <span className="bubble__time">{message.time}</span>
      </div>
    </div>
  );
}

// Messages re-render often as new ones arrive; memoize since each bubble's
// own props rarely change once rendered.
export default memo(MessageBubble);
