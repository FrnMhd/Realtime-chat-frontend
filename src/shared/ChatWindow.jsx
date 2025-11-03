import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import api, { authHeader } from "../api";

export default function ChatWindow({ token, user, chat }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(null);
  const endRef = useRef(null);

  // create socket once
  useEffect(() => {
    const s = io((import.meta.env.VITE_API_URL), {
      auth: { token },
      withCredentials: true
    });

    setSocket(s);
    return () => s.disconnect();
  }, [token]);

  // join room + listeners when socket & chat ready
  useEffect(() => {
    if (!socket || !chat) return;

    socket.emit("join_chat", { chatId: chat._id });

    const onReceive = (msg) => {
      if (msg.chatId === chat._id) {
        setMessages(prev => [...prev, msg]);
      }
    };

    socket.on("receive_message", onReceive);

    return () => {
      socket.off("receive_message", onReceive);
    };
  }, [socket, chat]);

  // fetch history when chat changes
  useEffect(() => {
    if (!chat) return;
    async function load() {
      try {
        const res = await api.get(`/api/messages/${chat._id}`, { headers: authHeader() });
        setMessages(res.data || []);
        // scroll later after DOM update
        setTimeout(()=> endRef.current?.scrollIntoView({behavior:"auto"}), 50);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [chat]);

  // auto scroll when messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    const payload = { chatId: chat._id, content: text, contentType: "text" };
    socket.emit("send_message", payload);
    // optimistic UI: will also get via receive_message, but push now for instant view
    // setMessages(prev => [...prev, { ...payload, sender: user._id, createdAt: new Date().toISOString(), _id: "tmp-"+Date.now() }]);
    setText("");
  };

  return (
    <div className="chat-window" style={{height:"100%"}}>
      <div className="messages">
        {messages.map(m => {
          const me = String(m.sender) === String(user._id) || (m.sender?._id && m.sender._id === user._id);
          return (
            <div key={m._id} className={`msg ${me ? "me" : "you"}`}>
              {m.content}
              <div style={{fontSize:11, color:"#666", marginTop:6}}>{new Date(m.createdAt).toLocaleTimeString()}</div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="input-area" style={{display:"flex",gap:8,padding:8,borderTop:"1px solid #ccc",position:"sticky",bottom:0,backgroundColor:"#f9f9f9"}}>
        <input placeholder="Type a message..." value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=> e.key==="Enter" && send()} />
        <button className="btn" onClick={send}>Send</button>
      </div>
    </div>
  );
}
