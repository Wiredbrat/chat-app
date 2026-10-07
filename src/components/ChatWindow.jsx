import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import Avatar from "./Avatar.jsx";
import MessageBubble from "./MessageBubble.jsx";
import Composer from "./Composer.jsx";
import { MenuIcon } from "./Icons.jsx";
import { getMessages } from "../api/connection.js";
import { useParams } from "react-router-dom";
import useChatStore from "../store/useChatStore.js";
import toast from "react-hot-toast/headless";
import { getDayLabel, isDifferentDay } from "../utils/utils.js";
import useOnlineStore from "../store/useOnlineStore.js";

function ChatWindow({ conversation, isTyping, onSend, onOpenSidebar }) {
  const scrollRef = useRef(null);
  const topObserverRef = useRef(null);
  const scrollHeightBeforeRef = useRef(0);

  const { conversationId } = useParams();
  const {
    addMessage,
    addPreviousMessages,
    messages,
    setActiveChat,
    activeChat,
    getLastMessage,
    getInitialChatRendered,
    getBeforeTimestamp,
  } = useChatStore();

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const getOnlineUsers = useOnlineStore(state => state.getOnlineUsers);

  // 1. Fetch messages with cursor/page pagination support
  const loadMessages = async (beforeTimestamp = "") => {
    if (loading || !hasMore) return;

    setLoading(true);

    // Save height before prepending new messages to prevent UI jump
    if (scrollRef.current && beforeTimestamp) {
      scrollHeightBeforeRef.current = scrollRef.current.scrollHeight;
    }

    if (!getInitialChatRendered(conversationId) || beforeTimestamp) {
      try {
        const res = await getMessages(conversationId, beforeTimestamp);
        if (res?.success) {
          const fetchedBucketsOrMsgs = res.data?.messages || [];
          // console.log("message bucket: ", fetchedBucketsOrMsgs);
          // If returned payload is smaller than limit/page size, no more old messages exist
          if (fetchedBucketsOrMsgs.length === 0) {
            setHasMore(false);
          } else {
            addPreviousMessages(conversationId, fetchedBucketsOrMsgs);
          }
        }
      } catch (error) {
        toast.error(error.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    }
  };

  // 2. Reset states and load initial batch when active conversation changes
  useEffect(() => {
    if (!conversationId) return;

    setActiveChat(conversationId);
    setHasMore(true);
    setIsInitialLoad(true);

    loadMessages();
  }, [conversationId]);

  // 3. Keep scroll position stationary after prepending historical messages
  useLayoutEffect(() => {
    if (scrollRef.current && scrollHeightBeforeRef.current > 0) {
      const container = scrollRef.current;
      const newScrollHeight = container.scrollHeight;

      // Adjust scrollTop by the height difference of added messages
      container.scrollTop = newScrollHeight - scrollHeightBeforeRef.current;
      scrollHeightBeforeRef.current = 0;
    }
  }, [messages[conversationId]]);

  const prevLastMessageIdRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    const currentMessages = messages[conversationId] || [];
    const currentLastMessage = currentMessages[currentMessages.length - 1];
    const currentLastMessageId = currentLastMessage?._id;

    // 1. Initial Load: Auto-scroll to bottom once
    if (isInitialLoad && currentMessages.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setIsInitialLoad(false);
    }
    // 2. New message sent or received at the bottom
    else if (
      currentLastMessageId &&
      currentLastMessageId !== prevLastMessageIdRef.current
    ) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // 3. Typing indicator toggled
    else if (!scrollHeightBeforeRef.current && isTyping) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    // Update tracking ref without triggering a re-render
    prevLastMessageIdRef.current = currentLastMessageId;
  }, [isInitialLoad, messages[conversationId], isTyping]);

  // console.log(messages[conversationId]);
  // 5. IntersectionObserver to trigger loading when user scrolls to top
  useEffect(() => {
    const target = topObserverRef.current;

    if (!target || !conversationId) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          !entries[0].isIntersecting ||
          loading ||
          !hasMore ||
          isInitialLoad
        ) {
          return;
        }

        const beforeTimestamp = getBeforeTimestamp(conversationId);

        if (!beforeTimestamp) {
          setHasMore(false);
          return;
        }

        console.log(
          `Loading older messages for ${conversationId}`,
          beforeTimestamp,
        );

        loadMessages(beforeTimestamp);
      },
      {
        threshold: 0.5,
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [conversationId, loading, hasMore, isInitialLoad, getBeforeTimestamp]);

  if (!conversation) {
    return (
      <div className="chat">
        <div className="empty-state">
          <h2>No conversation selected</h2>
          <p>Pick a conversation from the list to start chatting.</p>
        </div>
      </div>
    );
  }

  // Flatten messages if they are nested inside Mongoose bucket documents
  const allMessages = (messages[conversationId] || []).flatMap(
    (item) => item.messages || item,
  );

  let prevMessage = null;

  // console.log(getOnlineUsers(conversation?.participants[0]?._id));
  // console.log(conversation?.participants[0]?._id);
  // console.log(onlineStore?.get(conversation?.participants[0]?._id));
  return (
    <div className="chat">
      <header className="chat__header">
        <button
          className="chat__header-menu"
          onClick={onOpenSidebar}
          aria-label="Open conversation list"
        >
          <MenuIcon />
        </button>
        <Avatar initials={conversation.initials} online={conversation.online} />
        <div className="chat__header-info">
          <div className="chat__header-name">
            {conversation?.participants?.[0]?.username}
          </div>
          <div
            className="chat__header-status"
            style={{
              color: getOnlineUsers(conversation?.participants[0]?._id) ? "var(--color-online)" : "var(--color-ink-faint)",
            }}
          >
            {getOnlineUsers(conversation?.participants[0]?._id) ? "Online" : "Offline"}
          </div>
        </div>
      </header>

      <div className="chat__messages" ref={scrollRef}>
        {/* Infinite Scroll Top Trigger Anchor */}
        <div ref={topObserverRef} style={{ height: "1px" }} />

        {loading && (
          <div className="chat__loading">Loading older messages...</div>
        )}

        {!hasMore && allMessages.length > 0 && (
          <div className="chat__day-divider">Beginning of conversation</div>
        )}

        {allMessages.length > 0 && (
          <>
            {/* <div className="chat__day-divider">Today</div>*/}
            {allMessages.map((m, index) => {
              const prevMessage =
                index > 0 ? allMessages[index - 1] : allMessages[index];
              const showDivider =
                index === 0 ||
                isDifferentDay(
                  prevMessage?.createdAt || prevMessage?.timestamp,
                  m?.createdAt || m?.timestamp,
                );
              // console.log(prevMessage, m, index)

              return (
                <React.Fragment key={m?._id + '-' + index}>
                  {showDivider && (
                    <div className="chat__day-divider">
                      <span>{getDayLabel(m?.createdAt || m?.timeStamp)}</span>
                    </div>
                  )}
                  <MessageBubble key={m?._id} message={m} />
                </React.Fragment>
              );
            })}
          </>
        )}

        {isTyping && (
          <div className="msg-row msg-row--in">
            <Avatar initials={conversation.initials} size={26} />
            <div className="bubble">
              <span className="typing-indicator">
                <span />
                <span />
                <span />
              </span>
            </div>
          </div>
        )}
      </div>

      <Composer onSend={onSend} />
    </div>
  );
}

export default ChatWindow;
