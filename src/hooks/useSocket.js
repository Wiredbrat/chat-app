import { useRef, useEffect } from "react";
import useSocketStore from "../store/useSocketStore";
import useChatStore from "../store/useChatStore";
// import { useChat } from "./useChat";
import { useParams } from "react-router-dom";
import useOnlineStore from "../store/useOnlineStore";

export function useSocket(url) {
  const { setSocket, setIsConnected } = useSocketStore();
  const { activeChat, addMessage } = useChatStore();
  const { addOnlineUser, removeOnlineUser } = useOnlineStore();

  const socketRef = useRef();
  useEffect(() => {
    const wsInstance = new WebSocket(url);
    socketRef.current = wsInstance;

    // console.log(socketRef.current);

    socketRef.current.onopen = () => {
      setIsConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // console.log("activeChat>>>>", useChatStore.getState().activeChat)
        if(data.type === "presence") {
          console.log("message received: ", data);
          if(data?.data?.status === "online") {
            addOnlineUser(data?.data?.userId);
          } else {
            removeOnlineUser(data.userId);
          }
        }
        // if(data?.data?.type === "Incoming") {
        addMessage(data.data.roomId, data?.data);
        // }
      } catch (error) {
        // console.error(error);
      }
    };

    socketRef.current.onclose = () => {
      setIsConnected(false);
    };

    socketRef.current.onerror = (error) => {
      // console.error('WebSocket Error:', error);
    };

    setSocket(socketRef.current);

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }

      setSocket(null);
      setIsConnected(false);
    };
  }, [url, setSocket, setIsConnected]);
}
