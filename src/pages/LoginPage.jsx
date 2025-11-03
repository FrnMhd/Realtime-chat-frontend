import React, { useState } from "react";
import api, { authHeader } from "../api";

export default function LoginPage({ onAuth }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // optional
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleLoginOrRegister() {
    setErr("");
    setLoading(true);
    try {
      // Try login
      const res = await api.post("/api/auth/login", { username, password });
      const data = res.data;
      onAuth({ token: data.token, user: data.user });
    } catch (e) {
      // if login fails, try register
      try {
        await api.post("/api/auth/register", { username, email, password });
        // login after register
        const res2 = await api.post("/api/auth/login", { username, password });
        onAuth({ token: res2.data.token, user: res2.data.user });
      } catch (err2) {
        console.error(err2);
        setErr(err2.response?.data?.msg || "Auth failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{padding:20}}>
      <div className="login-wrap">
        <h2>EchoLink — Login or Register</h2>
        <p className="small">Enter a username & password. If user doesn't exist, the app will register automatically.</p>

        <div style={{marginTop:12}}>
          <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} style={{width:"100%",padding:8,marginBottom:8}} />
          <input placeholder="email (optional for register)" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%",padding:8,marginBottom:8}} />
          <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:"100%",padding:8,marginBottom:8}} />
          {err && <div style={{color:"crimson", marginBottom:8}}>{err}</div>}
          <button className="btn" onClick={handleLoginOrRegister} disabled={loading}>
            {loading ? "Working..." : "Login / Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
