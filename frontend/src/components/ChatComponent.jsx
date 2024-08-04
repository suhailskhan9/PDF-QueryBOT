// import React, { useState } from 'react';
// import axios from 'axios';

// const FileUploadComponent = () => {
//     const [files, setFiles] = useState([]);
//     const [question, setQuestion] = useState('');
//     const [answer, setAnswer] = useState('');

//     const handleFileChange = (e) => {
//         setFiles(e.target.files);
//     };

//     const handleQuestionChange = (e) => {
//         setQuestion(e.target.value);
//     };
//     const handleUpload = async () => {
//         const formData = new FormData();
//         for (let i = 0; i < files.length; i++) {
//             formData.append('files', files[i]);
//         }
//         try {
//             await axios.post('http://localhost:8000/upload', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//         } catch (error) {
//             if (error.response) {
//                 // The request was made and the server responded with a status code
//                 // that falls out of the range of 2xx
//                 console.error('Server responded with status:', error.response.status);
//                 console.error('Response data:', error.response.data);
//             } else if (error.request) {
//                 // The request was made but no response was received
//                 console.error('No response received from server.');
//             } else {
//                 // Something happened in setting up the request that triggered an error
//                 console.error('Error setting up the request:', error.message);
//             }
//         }
//     };
    

//     const handleAskQuestion = async () => {
//         try {
//             const response = await axios.post('http://localhost:8000/ask', {
//                 question,
//             });
//             setAnswer(response.data.answer);
//         } catch (error) {
//             console.error('Error asking question:', error);
//         }
//     };

//     return (
//         <div>
//             <input type="file" multiple onChange={handleFileChange} />
//             <button onClick={handleUpload}>Upload PDFs</button>
//             <br />
//             <input
//                 type="text"
//                 placeholder="Ask a question"
//                 value={question}
//                 onChange={handleQuestionChange}
//             />
//             <button onClick={handleAskQuestion}>Ask</button>
//             <div>
//                 <h3>Answer:</h3>
//                 <p>{answer}</p>
//             </div>
//         </div>
//     );
// };

// export default FileUploadComponent;



// ChatComponent.js
import { useState } from 'react';
import axios from 'axios';
import '../styles/ChatComponent.css'; // Import the CSS file
import chatLogo from '../assets/chatLogo.png'
import userLogo from '../assets/userLogo.png'
import sendIcon from '../assets/sendIcon.png'

const ChatComponent = () => {
    const [question, setQuestion] = useState('');
    const [chatHistory, setChatHistory] = useState([]); // State for maintaining chat history
    const [status, setStatus] = useState('') // State for tracking the request status
    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleAskQuestion = async () => {
        try {
            setStatus('Waiting for response...');
            const response = await axios.post('https://pdf-querybot.onrender.com/ask', {
                question,
            });
            const newAnswer = response.data.answer;
            
            // setChatHistory([...chatHistory, { question, answer: newAnswer }]); // Update chat history
          
            // Typing effect: Render letter by letter
            let currentAnswer = '';
            setQuestion(''); // Clear the question input
            setStatus(''); // Clear the status
            for (let i = 0; i < newAnswer.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Adjust the timeout as needed for typing speed
                currentAnswer += newAnswer[i];
                setChatHistory([...chatHistory, { question, answer: currentAnswer }]);
            }
                
           
           
            

        } catch (error) {
            console.error('Error asking question:', error);
            setStatus('Error') // Set status to error
        }
    };

    return (
        <div className="container">
            <div className="chat-section">
                <div className="chat-history">
                    {chatHistory.map((chat, index) => (
                        <div key={index} className="chat-message">
                        <div className="user-chat-entry">
                          <img src={userLogo} />
                          <p>{chat.question}</p>
                        </div>
                        <div className="ai-chat-entry">
                        <img src={chatLogo} alt="Q" className="chat-logo" />
                          <p>{chat.answer}</p>
                        </div>
                      </div>
                    ))}
                </div>
                {status && <div className="status-message">{status}</div>}
                <div className="chat-input">
                    <input
                        type="text"
                        placeholder="Type you question..."
                        value={question}
                        onChange={handleQuestionChange}
                    />
                    <img src={sendIcon} alt="" onClick={handleAskQuestion}/>
                    {/* <button onClick={handleAskQuestion}>Ask</button> */}
                </div>
            </div>
        </div>
    );
};

export default ChatComponent;
