import React from "react";

export default function ChatList({ chats, onSelect, selected }) {
  if (!chats?.length) return <div className="small">No chats yet</div>;

  return chats.map(chat => {
    // pick the other participant
    const other = chat.participants?.find(p => p._id !== selected?._id); // don't include current user
    const partner = other || chat.participants?.[1]; // simple
    // try find other user (current user's id isn't passed here; main filters it client-side)
    const title = partner?.username || "Unknown";

    return (
      <div key={chat._id} className="chat-item" onClick={()=>onSelect(chat)}>
        <div style={{fontWeight:600}}>{title}</div>
        <div className="meta">{chat.lastMessage?.content || "No messages yet"}</div>
      </div>
    );
  });
}
