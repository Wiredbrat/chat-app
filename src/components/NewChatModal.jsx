import { useEffect, useRef, useState } from 'react';
import { CloseIcon } from './Icons.jsx';
import { debounce } from '../utils/utils.js';
import { getUserByUsername } from '../api/connection.js';
import Avatar from './Avatar.jsx';

/**
 * Small centered dialog for starting a new conversation. Matches the visual
 * language of AuthPage's card (same radius/shadow/field styles) rather than
 * a native browser prompt.
 */
function NewChatModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [userSearchResult, setUserSearchResult] = useState([]);
  const [selectedUser, setSelectedser] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (userId) => {
    onCreate(userId);
  };

  const handleSearch = async (query) => {
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      // setError('Enter a name to start a chat.');
      return;
    }
    try {
      const res = await getUserByUsername(query);
      if(res.success) {
        setUserSearchResult(res.data)
      }
     // console.log(res);
    } catch (error) {
     // console.log(error.message)
    }
  }

  const debounceSearch = debounce(handleSearch, 1500)

  const createChatRoom = async (userId) => {

  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="new-chat-title" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 id="new-chat-title" className="modal__title">
            New chat
          </h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          <label className="modal__field">
            <span></span>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                handleSearch(e.target.value)
                if (error) setError('');
              }}
              placeholder="Search by user or group name"
            />
          </label>

          {error && <p className="modal__error">{error}</p>}

          <div>
            <ul className="sidebar__list" style={{ listStyle: 'none', margin: 0 }}>
              {userSearchResult.map((result) => (
                <li key={result._id}>
                  <button
                    type="button"
                    className={`conversation`}
                    onClick={() => {
                      handleSubmit(result._id);
                      onClose();
                    }}
                  >
                    <Avatar initials={"WB"} online={true} />
                    <span className="conversation__body">
                      <span className="conversation__top">
                        <span className="conversation__name">{result.username}</span>
                      </span>
                    </span>
                  </button>
                </li>
              ))}
              {userSearchResult.length === 0 && (
                <p style={{ color: 'var(--color-ink-faint)', padding: '5px', fontSize: 13 , textAlign: "center"}}>No user found.</p>
              )}
            </ul>
          </div>

          {/* <div className="modal__actions">
            <button type="button" className="modal__cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal__submit">
              Start chat
            </button>
          </div> */}
        </form>
      </div>
    </div>
  );
}

export default NewChatModal;