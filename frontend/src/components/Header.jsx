import { useState } from "react";
import { api, getErrorMessage } from "../api";
import "../styles/Header.css";
import logo from "../assets/logo.png";
import addIcon from "../assets/gala_add.png";
import Spinner from "./Spinner";

function Header({ session, setSession, loading, setLoading }) {
  const [uploadError, setUploadError] = useState("");

  const handleFileUpload = async (event) => {
    const selected = Array.from(event.target.files);
    event.target.value = ""; // allows re-selecting the same file later
    if (selected.length === 0) return;

    setLoading(true);
    setUploadError("");

    const formData = new FormData();
    selected.forEach((f) => formData.append("files", f));

    try {
      const { data } = await api.post("/upload", formData);
      const previousId = session?.id;

      setSession({ id: data.session_id, fileNames: selected.map((f) => f.name) });

      // Best-effort cleanup of the old index; the server TTL covers failures
      if (previousId) {
        api.delete(`/session/${previousId}`).catch(() => {});
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadError(
        getErrorMessage(error, "Upload failed. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const names = session?.fileNames ?? [];

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
        <span className="logo-text">PDF QueryBot</span>
      </div>

      <div className="upload-section">
        {uploadError && <span className="file-name file-error" data-testid="upload-error">{uploadError}</span>}
        {names.length > 0 && (
          <span className="file-name file-uploaded" data-testid="file-name">
            {names[0]} {names.length > 1 ? `+${names.length - 1}` : ""}
          </span>
        )}
        <label className="upload-button">
          <img src={addIcon} alt="" className="addIcon" />
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={loading}
            data-testid="file-input"
          />
          Upload PDF
        </label>
        {loading && <div data-testid="upload-spinner"><Spinner /></div>}
      </div>
    </header>
  );
}

export default Header;