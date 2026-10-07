import { memo } from 'react';
import Avatar from './Avatar.jsx';
import useAuth from '../store/userStore.js';

function MessageBubble({ message, initials = "NW", showAvatar }) {
  const { user } = useAuth();
  const isOut = message.type === 'Outgoing' || message.sender === user[0]?._id;
  // console.log("sender: ",message.sender)
  // console.log("user: ",user)
  const time = new Date(message?.timestamp || message?.createdAt)?.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return (
    <div className={`msg-row ${isOut ? 'msg-row--out' : 'msg-row--in'}`}>
      {/* {!isOut && (showAvatar ? <Avatar initials={initials} size={26} /> : <div style={{ width: 26 }} />)} */}
      <div className="bubble">
        <span>{message?.message}</span>
        <span className='bubble__time'>{time}</span>
      </div>
    </div>
  );
}

// Messages re-render often as new ones arrive; memoize since each bubble's
// own props rarely change once rendered.
export default memo(MessageBubble);
