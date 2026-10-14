// import { useEffect, useRef, useState } from 'react';
// import { CloseIcon } from './Icons.jsx';
// import { debounce } from '../utils/utils.js';
// import { getUserByUsername } from '../api/connection.js';
// import Avatar from './Avatar.jsx';

// /**
//  * Small centered dialog for starting a new conversation. Matches the visual
//  * language of AuthPage's card (same radius/shadow/field styles) rather than
//  * a native browser prompt.
//  */
// function NewChatModal({ onClose, onCreate }) {
//   const [name, setName] = useState('');
//   const [error, setError] = useState('');
//   const [userSearchResult, setUserSearchResult] = useState([]);
//   const inputRef = useRef(null);

//   useEffect(() => {
//     inputRef.current?.focus();

//     const handleKeyDown = (e) => {
//       if (e.key === 'Escape') onClose();
//     };
//     document.addEventListener('keydown', handleKeyDown);
//     return () => document.removeEventListener('keydown', handleKeyDown);
//   }, [onClose]);

//   const handleSubmit = (userId) => {
//     onCreate(userId);
//   };

//   const handleSearch = async (query) => {
//     const trimmed = query.trim();
//     if (trimmed.length < 3) {
//       // setError('Enter a name to start a chat.');
//       return;
//     }
//     try {
//       const res = await getUserByUsername(query);
//       if(res.success) {
//         setUserSearchResult(res.data)
//       }
//      // console.log(res);
//     } catch (error) {
//      // console.log(error.message)
//     }
//   }

//   const debounceSearch = debounce(handleSearch, 1500)

//   const createChatRoom = async (userId) => {

//   }

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal" role="dialog" aria-modal="true" aria-labelledby="new-chat-title" onClick={(e) => e.stopPropagation()}>
//         <div className="modal__header">
//           <h2 id="new-chat-title" className="modal__title">
//             New chat
//           </h2>
//           <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
//             <CloseIcon />
//           </button>
//         </div>

//         <form className="modal__form" onSubmit={handleSubmit}>
//           <label className="modal__field">
//             <span></span>
//             <input
//               ref={inputRef}
//               type="text"
//               value={name}
//               onChange={(e) => {
//                 setName(e.target.value);
//                 handleSearch(e.target.value)
//                 if (error) setError('');
//               }}
//               placeholder="Search by user"
//             />
//           </label>

//           {error && <p className="modal__error">{error}</p>}

//           <div>
//             <ul className="sidebar__list" style={{ listStyle: 'none', margin: 0 }}>
//               {userSearchResult.map((result) => (
//                 <li key={result._id}>
//                   <button
//                     type="button"
//                     className={`conversation`}
//                     onClick={() => {
//                       handleSubmit(result._id);
//                       onClose();
//                     }}
//                   >
//                     <Avatar initials={"WB"} online={true} />
//                     <span className="conversation__body">
//                       <span className="conversation__top">
//                         <span className="conversation__name">{result.username}</span>
//                       </span>
//                     </span>
//                   </button>
//                 </li>
//               ))}
//               {userSearchResult.length === 0 && (
//                 <p style={{ color: 'var(--color-ink-faint)', padding: '5px', fontSize: 13 , textAlign: "center"}}>No user found.</p>
//               )}
//             </ul>
//           </div>

//           {/* <div className="modal__actions">
//             <button type="button" className="modal__cancel" onClick={onClose}>
//               Cancel
//             </button>
//             <button type="submit" className="modal__submit">
//               Start chat
//             </button>
//           </div> */}
//         </form>
//       </div>
//     </div>
//   );
// }

// export default NewChatModal;

import { useEffect, useRef, useState } from "react";
import { CheckIcon, CloseIcon, PlusIcon, SearchIcon } from "./Icons.jsx";
import { getUserByUsername } from "../api/connection.js";
import Avatar from "./Avatar.jsx";

function NewChatModal({ onClose, onCreate, onCreateGroup }) {
  const [activeTab, setActiveTab] = useState("individual");
  const [name, setName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const [userSearchResult, setUserSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const inputRef = useRef(null);

  const [isClosing, setIsClosing] = useState(false);
  const [dragY, setDragY] = useState(0);

  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  const closeModal = () => {
    if (isClosing) return;

    setIsClosing(true);

    // Allow the closing animation to finish before unmounting.
    setTimeout(() => {
      onClose();
    }, 200);
  };

  useEffect(() => {
    inputRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Search users for both individual and group chats.
  useEffect(() => {
    const query = name.trim();

    if (query.length < 3) {
      setUserSearchResult([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);

    const timeoutId = setTimeout(async () => {
      try {
        const res = await getUserByUsername(query);

        if (!cancelled && res.success) {
          setUserSearchResult(res.data || []);
        } else if (!cancelled) {
          setUserSearchResult([]);
        }
      } catch (err) {
        if (!cancelled) {
          setUserSearchResult([]);
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [name]);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;

    const deltaY = e.touches[0].clientY - touchStartY.current;

    // Only allow downward dragging.
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;

    if (dragY > 100) {
      closeModal();
    } else {
      setDragY(0);
    }
  };

  const handleSubmit = (userId) => {
    onCreate(userId);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setName("");
    setError("");
    setUserSearchResult([]);
  };

  const toggleUser = (user) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((item) => item._id === user._id);

      if (exists) {
        return prev.filter((item) => item._id !== user._id);
      }

      return [...prev, user];
    });

    setError("");
  };

  const removeSelectedUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((user) => user._id !== userId));
  };

  const createGroup = async () => {
    if (selectedUsers.length < 2) {
      setError("Select at least two users to create a group.");
      return;
    }

    if (!groupName.trim()) {
      setError("Enter a group name.");
      return;
    }

    if (!onCreateGroup) {
      setError("Group creation is not connected to the backend yet.");
      return;
    }

    try {
      setIsCreating(true);
      setError("");

      await onCreateGroup({
        groupName: groupName.trim(),
        memberIds: selectedUsers.map((user) => user._id),
      });

      onClose();
    } catch (err) {
      setError(err.message || "Failed to create group.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-chat-title"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateY(${isClosing ? "100%" : `${dragY}px`})`,
          transition:
            isDragging.current && dragY > 0 ? "none" : "transform 200ms ease",
        }}
      >
        <div className="modal__header">
          <h2 id="new-chat-title" className="modal__title">
            New conversation
          </h2>

          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Individual / Group tabs */}
        <div
          className="new-chat-tabs"
          role="tablist"
          aria-label="Conversation type"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "individual"}
            className={`new-chat-tab ${
              activeTab === "individual" ? "active" : ""
            }`}
            onClick={() => handleTabChange("individual")}
          >
            Individual
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "group"}
            className={`new-chat-tab ${activeTab === "group" ? "active" : ""}`}
            onClick={() => handleTabChange("group")}
          >
            Group
          </button>
        </div>

        <div className="modal__form">
          {activeTab === "group" && (
            <>
              <label className="modal__field">
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  maxLength={50}
                />
              </label>

              <p className="group-section-title">Add group members</p>

              {/* Selected users */}
              {selectedUsers.length > 0 && (
                <div className="selected-users">
                  {selectedUsers.map((user) => (
                    <div className="selected-user-chip" key={user._id}>
                      <span>{user.username}</span>

                      <button
                        type="button"
                        aria-label={`Remove ${user.username}`}
                        onClick={() => removeSelectedUser(user._id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <label className="modal__field">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder={
                activeTab === "individual"
                  ? "Search by username"
                  : "Search users to add"
              }
            />
          </label>

          {isSearching && <p className="search-status">Searching users...</p>}

          <ul
            className="sidebar__list"
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {!isSearching && 
              userSearchResult.map((user) => {
                const isSelected = selectedUsers.some(
                  (item) => item._id === user._id,
                );

                return (
                  <li key={user._id}>
                    <button
                      type="button"
                      className="conversation"
                      onClick={() => {
                        if (activeTab === "individual") {
                          handleSubmit(user._id);
                          onClose();
                        } else {
                          toggleUser(user);
                        }
                      }}
                    >
                      <Avatar
                        avatar={user.avatar}
                        online={false}
                      />

                      <span className="conversation__body">
                        <span className="conversation__top">
                          <span className="conversation__name">
                            {user.username}
                          </span>
                        </span>
                      </span>

                      {activeTab === "group" && (
                        <span className="group-user-check">
                          {isSelected ? <CheckIcon/> : <PlusIcon/>}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}

            {!isSearching &&
              name.trim().length >= 3 &&
              userSearchResult.length === 0 && (
                <li
                  style={{
                    color: "var(--color-ink-faint)",
                    padding: "12px 5px",
                    fontSize: 13,
                    textAlign: "center",
                  }}
                >
                  No users found.
                </li>
              )}
          </ul>

          {activeTab === "group" && (
            <div className="group-create-section">
              <p className="group-member-count">
                {selectedUsers.length} member
                {selectedUsers.length !== 1 ? "s" : ""} selected
              </p>

              {error && <p className="modal__error">{error}</p>}

              <button
                type="button"
                className="modal__submit"
                disabled={
                  isCreating || selectedUsers.length < 2 || !groupName.trim()
                }
                onClick={createGroup}
              >
                {isCreating ? "Creating..." : "Create Group"}
              </button>
            </div>
          )}

          {activeTab === "individual" && error && (
            <p className="modal__error">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewChatModal;
