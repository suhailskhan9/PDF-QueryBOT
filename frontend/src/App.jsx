import { useState } from "react";
import Header from "./components/Header";
import ChatComponent from "./components/ChatComponent";
import "./styles/App.css";

const STORAGE_KEY = "pdf_session";

function loadSession() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

function App() {
  // session = { id: string, fileNames: string[] } or null
  const [session, setSessionState] = useState(loadSession);
  const [loading, setLoading] = useState(false);

  const setSession = (next) => {
    try {
      if (next) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable: app still works for this page load */
    }
    setSessionState(next);
  };

  return (
    <div className="App">
      <Header
        session={session}
        setSession={setSession}
        loading={loading}
        setLoading={setLoading}
      />
      <ChatComponent
        session={session}
        loading={loading}
        onSessionExpired={() => setSession(null)}
      />
    </div>
  );
}

export default App;