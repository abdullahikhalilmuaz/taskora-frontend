import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useSocket } from "../../context/SocketContext.jsx";
import { api } from "../../utils/api.js";
import ChatMessage from "./ChatMessage.jsx";
import ChatInput from "./ChatInput.jsx";
import { playSound } from "../../utils/sounds.js";

export default function ChatBox({ taskId }) {
  const { user } = useAuth();
  const { socket, joinTaskRoom, leaveTaskRoom, sendChat, connected } =
    useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get("/api/messages/task/" + taskId);
        setMessages(data.messages || []);
      } catch {}
      setLoading(false);
    })();
    joinTaskRoom(taskId);
    return () => leaveTaskRoom(taskId);
  }, [taskId]);

  useEffect(() => {
    if (!socket) return;
    const onNew = (msg) => {
      if (msg.taskId !== taskId) return;
      setMessages((m) => {
        // avoid duplicate if we just sent via REST
        if (m.some((x) => x._id === msg._id)) return m;
        return [...m, msg];
      });
      if (msg.senderName !== user?.name) playSound("message");
    };
    socket.on("chat:new", onNew);
    return () => socket.off("chat:new", onNew);
  }, [socket, taskId, user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async (text) => {
    // Try socket first if connected
    if (connected) {
      sendChat(taskId, text);
      return;
    }
    // REST fallback
    setSending(true);
    try {
      const res = await api.post("/api/messages/task/" + taskId, { text });
      if (res?.message) {
        setMessages((m) => [...m, res.message]);
      }
    } catch (e) {
      console.error("send failed", e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 320,
      }}
    >
      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: "auto", paddingRight: 4, maxHeight: 400 }}
      >
        {loading && (
          <div
            style={{
              color: "var(--text-3)",
              fontSize: 13,
              textAlign: "center",
              padding: 20,
            }}
          >
            Loading messages...
          </div>
        )}
        {!loading && messages.length === 0 && (
          <div
            style={{
              color: "var(--text-3)",
              fontSize: 13,
              textAlign: "center",
              padding: 20,
            }}
          >
            No messages yet — start the conversation
          </div>
        )}
        {messages.map((m) => (
          <ChatMessage key={m._id} msg={m} mine={m.senderName === user?.name} />
        ))}
      </div>
      <ChatInput onSend={handleSend} disabled={sending} />
    </div>
  );
}
