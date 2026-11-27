import { useState, useRef, useEffect } from "react";
import { api, getErrorMessage } from "../api";
import "../styles/ChatComponent.css";
import chatLogo from "../assets/logo.png";
import userLogo from "../assets/userLogo.png";
import sendIcon from "../assets/sendIcon.png";

const ChatComponent = ({ session, loading, onSessionExpired }) => {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [status, setStatus] = useState("");
  const [asking, setAsking] = useState(false);
  const bottomRef = useRef(null);

  const canAsk = Boolean(session) && !loading && !asking;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAskQuestion();
  };

  const handleAskQuestion = async () => {
    const q = question.trim();
    if (!q || !canAsk) return; // guard: no duplicate in-flight requests

    const id = crypto.randomUUID();
    setAsking(true);
    setStatus("Waiting for response...");
    setQuestion("");
    setChatHistory((h) => [...h, { id, question: q, answer: "" }]);

    try {
      const { data } = await api.post("/ask", {
        question: q,
        session_id: session.id,
      });
      // Functional update: never overwrites other messages
      setChatHistory((h) =>
        h.map((m) => (m.id === id ? { ...m, answer: data.answer, sources: data.sources, answerable: data.answerable } : m))
      );
      setStatus("");
    } catch (error) {
      console.error("Error asking question:", error);
      setChatHistory((h) => h.filter((m) => m.id !== id));
      setQuestion(q); // give the question back so the user can retry

      if (error.response?.status === 404) {
        onSessionExpired();
        setStatus("Your documents have expired. Please upload them again.");
      } else {
        setStatus(
          getErrorMessage(error, "Something went wrong. Please try again.")
        );
      }
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="container">
      <div className="chat-section">
        <div className="chat-history">
          {chatHistory.length === 0 ? (
            <div className="welcome-message" data-testid="welcome-message">
              <h2>Welcome to PDF Query Bot</h2>
              <p>Upload PDF file/files and ask questions about its content.</p>
            </div>
          ) : (
            chatHistory.map((chat) => (
              <div key={chat.id} className="chat-message" data-testid="chat-message">
                <div className="user-chat-entry">
                  <img src={userLogo} alt="User" />
                  <p data-testid="user-message">{chat.question}</p>
                </div>
                {chat.answer && (
                  <div className="ai-chat-entry">
                    <img src={chatLogo} alt="Q" className="chat-logo" />
                    <p data-testid="ai-message">{chat.answer}</p>
                  </div>
                )}
                {chat.sources?.length > 0 && (
                  <div className="sources" data-testid="sources">
                    Sources:{" "}
                    {chat.sources
                      .map((s) => `${s.source}${s.page ? ` (p. ${s.page})` : ""}`)
                      .join(", ")}
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {status && <div className="status-message" data-testid="status-message">{status}</div>}

        <div className="chat-input-container">
          {!session && (
            <div className="upload-warning" data-testid="upload-warning">
              Please upload a PDF file before asking questions.
            </div>
          )}
          <div className="chat-input">
            <input
              type="text"
              data-testid="question-input"
              placeholder="Type your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!canAsk}
            />
            <img
              src={sendIcon}
              alt="Send"
              data-testid="send-button"
              onClick={handleAskQuestion}
              style={{ cursor: canAsk ? "pointer" : "not-allowed" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;