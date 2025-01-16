import { useState } from 'react';
import axios from 'axios';
import '../styles/ChatComponent.css'; 
import chatLogo from '../assets/logo.png'
import userLogo from '../assets/userLogo.png'
import sendIcon from '../assets/sendIcon.png'

const ChatComponent = ({ files, loading }) => {
    const [question, setQuestion] = useState('');
    const [chatHistory, setChatHistory] = useState([]); 
    const [status, setStatus] = useState('') 

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && files.length > 0 && !loading) {
            handleAskQuestion();
        }
    };

    const handleAskQuestion = async () => {
        const trimmedQuestion = question.trim();
        if (!trimmedQuestion || files.length === 0 || loading) {
            return;
        }

        try {
            setStatus('Waiting for response...');
            const response = await axios.post('https://pdf-querybot.onrender.com/ask', {
                question,
            });
            const newAnswer = response.data.answer;

            let currentAnswer = '';
            setQuestion('');
            setStatus(''); 

            for (let i = 0; i < newAnswer.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 100)); 
                currentAnswer += newAnswer[i];
                setChatHistory([...chatHistory, { question, answer: currentAnswer }]);
            }

        } catch (error) {
            console.error('Error asking question:', error);
            setStatus('Error')
        }
    };

    return (
        <div className="container">
            <div className="chat-section">
                <div className="chat-history">
                    {chatHistory.length === 0 ? (
                        <div className="welcome-message">
                        <h2>Welcome to PDF Query Bot</h2>
                        <p>Upload PDF file/files and ask questions about its content.</p>
                        </div>
                        ) : (
                            chatHistory.map((chat, index) => (
                            <div key={index} className="chat-message">
                                <div className="user-chat-entry">
                                <img src={userLogo} alt="User" />
                                <p>{chat.question}</p>
                                </div>
                                <div className="ai-chat-entry">
                                <img src={chatLogo} alt="Q" className="chat-logo" />
                                <p>{chat.answer}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {status && <div className="status-message">{status}</div>}
                <div className='chat-input-container'>
                {files.length === 0 && (
                        <div className="upload-warning">
                            Please upload a PDF file before asking questions.
                        </div>
                )}
                <div className="chat-input">
                    <input
                        type="text"
                        placeholder="Type you question..."
                        value={question}
                        onChange={handleQuestionChange}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                        required
                    />
                    <img 
                        src={sendIcon} 
                        alt="Send" 
                        onClick={handleAskQuestion}
                        style={{cursor: files.length === 0 || loading ? 'not-allowed' : 'pointer'}}
                    />
                </div>
                
                </div>
            </div>
        </div>
    );
};

export default ChatComponent;
