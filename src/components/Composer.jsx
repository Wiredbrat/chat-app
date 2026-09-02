import { useRef, useState } from 'react';
import { SendIcon } from './Icons.jsx';

function Composer({ onSend }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="composer">
      <label className="composer__field" style={{ width: '100%' }}>
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          placeholder="Write a message..."
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          aria-label="Message"
        />
      </label>
      <button
        type="button"
        className="composer__send"
        onClick={handleSend}
        disabled={!value.trim()}
        aria-label="Send message"
      >
        <SendIcon />
      </button>
    </div>
  );
}

export default Composer;
