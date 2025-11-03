import React, { useEffect, useState } from "react";
import ChatList from "../shared/ChatList";
import ChatWindow from "../shared/ChatWindow";
import api, { authHeader } from "../api";

export default function ChatPage({ token, user, onLogout }) {
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);

  async function loadChats() {
    try {
      const res = await api.get("/api/chat", { headers: authHeader() });
      setChats(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadChats();
    // optional: poll or websocket-driven updates for chat list later
    const interval = setInterval(loadChats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <div className="sidebar">
        <div className="header">
          <div>
            <strong>{user?.username}</strong>
            <div className="small">Logged in</div>
          </div>
          <div>
            <button className="btn" onClick={onLogout}>Logout</button>
          </div>
        </div>

        <div className="chat-list">
          <ChatList chats={chats} onSelect={(c)=> setSelected(c)} selected={selected} />
          <div style={{padding:12}}>
            <button className="btn" onClick={loadChats}>Refresh</button>
          </div>
        </div>
      </div>

      <div className="main" style={{overflow:"scroll", display:"flex", flexDirection:"column"}}>
        <div className="header" style={{position:"sticky", top:0, display:"flex", alignItems:"center", zIndex:999 ,backgroundColor:"#c8c6c6ff"}}>
          <div>{selected ? selected.participants.filter(p=>p._id !== user._id)[0]?.username : "Select a chat"}</div>
          <div className="small">{selected ? `Chat: ${selected._id}` : ""}</div>
        </div>

        <div style={{flex:1}}>
          {selected ? (
            <ChatWindow token={token} user={user} chat={selected} key={selected._id} />
          ) : (
            <div style={{display:"flex",height:"100%",alignItems:"center",justifyContent:"center"}}>Select a chat to start messaging</div>
          )}
        </div>
      </div>
    </div>
  );
}
