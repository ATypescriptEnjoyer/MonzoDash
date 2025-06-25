import { useEffect, useState } from "react";
import { socket } from "../../socket";

interface WebsocketEvent<T = unknown> {
  event: string;
  callback: (data: T) => void;
}

export const useWebsockets = <T = unknown>(events: WebsocketEvent<T>[]) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    }
  }, []);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onConnectError(error: string) {
      console.log(error);
      setEnabled(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('error', onConnectError);
    events.forEach((event) => {
      socket.on(event.event, event.callback);
    });


    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('error', onConnectError);
      events.forEach((event) => {
        socket.off(event.event, event.callback);
      });
    };
  }, [events]);

  const emit = (event: string, data?: string) => {
    socket.emit(event, data);
  }

  return {
    isConnected,
    emit,
    enabled,
  }
};