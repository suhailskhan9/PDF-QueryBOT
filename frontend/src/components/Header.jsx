import { useState } from 'react';
import axios from 'axios';
import '../styles/Header.css';
import logo from '../assets/AIPlanetLogo.png'
import addIcon from '../assets/gala_add.png'
function Header() {
  const [fileName, setFileName] = useState('');
  const [files, setFiles] = useState([]);

  const handleFileUpload = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 0) {
      setFileName(selectedFiles[0].name);
      setFiles(selectedFiles);
      handleUpload(selectedFiles); // Trigger the upload
    }
  };

  const handleUpload = async (selectedFiles) => {
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }
    try {
      await axios.post('https://pdf-querybot.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      if (error.response) {
        console.error('Server responded with status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received from server.');
      } else {
        console.error('Error setting up the request:', error.message);
      }
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="upload-section">
        <span className="file-name">{fileName}</span>
        <label className="upload-button">
          <img src = {addIcon} alt="" className='addIcon'/>
          <input type="file" multiple accept=".pdf" onChange={handleFileUpload} />
          Upload PDF
        </label>
      </div>
    </header>
  );
}

export default Header;
