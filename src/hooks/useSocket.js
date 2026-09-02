import { useRef, useEffect } from "react";
import useSocketStore from "../store/useSocketStore";

export function useSocket(url) {
  const setSocket = useSocketStore((state) => state.setSocket);
  const setIsConnected = useSocketStore((state) => state.setIsConnected);
  const socketRef = useRef();
  useEffect(() => {
    const wsInstance = new WebSocket(url);
    socketRef.current = wsInstance;

    console.log(socketRef.current);

    socketRef.current.onopen = () => {
      setIsConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("message received: ",event)
      } catch (error) {
        console.error(error);
      }
    };

    socketRef.current.onclose = () => {
      setIsConnected(false);
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    setSocket(socketRef.current);

    // Clean up connection when the component unmounts
    return () => {
      // socketRef.current.close();
      // if (socketRef.current === socketRef.current) {
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      // }
    };
  }, [url, setSocket, setIsConnected]);
}
