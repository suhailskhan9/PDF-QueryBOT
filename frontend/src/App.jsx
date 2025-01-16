import ChatComponent from "./components/ChatComponent";
import Header from "./components/Header"
import { useState } from 'react';
import './styles/App.css'

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  return (
        <div className="App">
          <Header files={files} setFiles={setFiles} setLoading={setLoading} loading={loading} />
          <ChatComponent files={files} loading={loading} />
        </div>
      );
  }

export default App
