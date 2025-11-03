import React, { useEffect, useState } from "react";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [token, user]);

  if (!token) {
    return <LoginPage onAuth={({ token, user }) => { setToken(token); setUser(user); }} />;
  }

  return <ChatPage token={token} user={user} onLogout={() => { setToken(null); setUser(null); localStorage.clear(); }} />;
}
