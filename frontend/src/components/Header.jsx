import { useState } from 'react';
import axios from 'axios';
import '../styles/Header.css';
import logo from '../assets/logo.png'
import addIcon from '../assets/gala_add.png'
import Spinner from './Spinner';
function Header({ files, setFiles, setLoading, loading }) {
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 0) {
      setFileName(selectedFiles[0].name);
      setFiles(selectedFiles);
      handleUpload(selectedFiles); 
    }
  };

  const handleUpload = async (selectedFiles) => {
    setLoading(true);
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
    console.error('Error uploading file:',error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" /> 
        <span className="logo-text">PDF QueryBot</span>
      </div>
      
      <div className="upload-section">
        {files.length > 0 && (
          <span className={'file-name file-uploaded'}>
            {fileName} {files.length > 1 ? `+${files.length - 1}` : ''}
          </span>
        )}
        <label className="upload-button">
          <img src = {addIcon} alt="" className='addIcon'/>
          <input type="file" multiple accept=".pdf" onChange={handleFileUpload} />
            Upload PDF
        </label>
        {loading && <Spinner />}
      </div>
    </header>
  );
}

export default Header;
