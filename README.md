# PDF-QueryBOT

PDF-QueryBOT is a full-stack application designed to allow users to upload PDF documents and interact with them through natural language processing. Users can ask questions about the content of uploaded PDF documents, and the application retrieves relevant information to generate context-based answers using Google's Gemini AI models.

## Application Architecture

The application is built using the following components:

- **Frontend**: Developed with React.js and Vite, providing a user-friendly interface for PDF uploads and natural language interaction.
- **Backend**: Built with FastAPI, handling PDF uploads, document processing, question processing, and answer retrieval.
- **PDF Processing**: Uses PyPDF to extract text from uploaded PDF documents.
- **NLP Processing**: Utilizes LangChain to process documents, split text into chunks, and manage retrieval and question-answering workflows.
- **Embedding Generation**: Uses Google Generative AI embeddings to convert document chunks into vector representations.
- **Vector Database**: Uses FAISS for storing and retrieving document embeddings.
- **AI Model**: Uses Google's Gemini models to generate answers based on the retrieved document context.
- **Session Management**: Maintains separate document indexes for individual sessions, allowing users to interact with their uploaded PDFs independently.

## Features

- Upload single or multiple PDF documents.
- Extract and process text from uploaded PDFs.
- Split extracted text into smaller chunks for efficient retrieval.
- Generate vector embeddings using Google Generative AI.
- Store and retrieve embeddings using FAISS.
- Ask natural language questions about uploaded documents.
- Generate context-based answers using Google's Gemini AI.
- Maintain separate sessions for uploaded documents.
- Automatically clean up expired session data.
- Delete previous sessions when replacing uploaded documents.

## Technologies Used

- **Frontend**: React.js, Vite, JavaScript, CSS, Axios
- **Backend**: Python, FastAPI, Uvicorn
- **PDF Processing**: PyPDF
- **NLP Framework**: LangChain
- **Embedding Model**: Google Generative AI Embeddings
- **Language Model**: Google Gemini
- **Vector Database**: FAISS
- **Environment Management**: Python Virtual Environment, dotenv

## Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/suhailskhan9/PDF-QueryBOT.git
   cd PDF-QueryBOT
   ```

2. **Install backend dependencies**:

   Navigate to the backend directory:

   ```bash
   cd backend
   ```

   Create and activate a virtual environment:

   ```bash
   python -m venv venv
   ```

   For Windows:

   ```bash
   venv\Scripts\activate
   ```

   For macOS/Linux:

   ```bash
   source venv/bin/activate
   ```

   Install the required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. **Configure backend environment variables**:

   Create a `.env` file inside the backend directory and configure the following variables:

   ```env
   GOOGLE_API_KEY=your_google_api_key_here

   INDEX_DIR=faiss_indexes
   MAX_FILE_SIZE_MB=20
   MAX_FILES=5
   SESSION_TTL_SECONDS=21600

   ALLOWED_ORIGINS=http://localhost:5173
   ```

4. **Start the backend server**:

   From the backend directory, run:

   ```bash
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

   The backend server will be available at:

   ```text
   http://localhost:8000
   ```

   API documentation can be accessed at:

   ```text
   http://localhost:8000/docs
   ```

5. **Install frontend dependencies**:

   Open another terminal and navigate to the frontend directory:

   ```bash
   cd frontend
   ```

   Install the required dependencies:

   ```bash
   npm install
   ```

6. **Configure frontend environment variables**:

   Create a `.env` file inside the frontend directory:

   ```env
   VITE_API_URL=http://localhost:8000
   ```

7. **Start the frontend application**:

   Run the following command:

   ```bash
   npm run dev
   ```

   The frontend application will be available at:

   ```text
   http://localhost:5173
   ```

## API Documentation

### 1. Upload PDFs

Uploads one or multiple PDF files, extracts their text, splits the extracted content into smaller chunks, generates vector embeddings, and stores them in a session-specific FAISS index.

**Endpoint**

`POST /upload`

**Request**

- **Content-Type:** `multipart/form-data`
- **Body Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `files` | `List[UploadFile]` | Yes | List of PDF files to upload and process |

**Response**

- **Success (200 OK)**

  ```json
  {
    "message": "PDFs uploaded and processed successfully",
    "session_id": "generated_session_id"
  }
  ```

The generated `session_id` is used for subsequent question-answering requests.

### 2. Ask a Question

Accepts a natural language question and retrieves relevant information from the PDFs associated with the specified session. The retrieved context is passed to Google's Gemini model to generate an answer.

**Endpoint**

`POST /ask`

**Request**

- **Content-Type:** `application/json`
- **Body Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `question` | `str` | Yes | The question to ask based on the uploaded PDF documents |
| `session_id` | `str` | Yes | The session ID associated with the uploaded PDF documents |

**Example Request**

```json
{
  "question": "What does this PDF contain?",
  "session_id": "generated_session_id"
}
```

**Response**

- **Success (200 OK)**

  ```json
  {
    "answer": "Context-based response generated from the uploaded PDF documents."
  }
  ```

### 3. Delete a Session

Deletes the FAISS index and associated data for a particular session. This endpoint can be used when replacing previously uploaded PDF documents.

**Endpoint**

`DELETE /session/{session_id}`

**Request**

- **Path Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `session_id` | `str` | Yes | The session ID to be deleted |

**Response**

- **Success:** Returns a confirmation message indicating that the session has been deleted.

### 4. Health Check

Checks whether the backend application is running.

**Endpoint**

`GET /health`

**Response**

- **Success (200 OK):** Returns the backend health status.

## Configuration

The application uses environment variables to manage API credentials and configuration settings.

| Environment Variable | Description |
|---|---|
| `GOOGLE_API_KEY` | Google AI API key used for embeddings and Gemini model access |
| `INDEX_DIR` | Directory used to store FAISS indexes |
| `MAX_FILE_SIZE_MB` | Maximum permitted PDF file size in MB |
| `MAX_FILES` | Maximum number of PDF files allowed per upload |
| `SESSION_TTL_SECONDS` | Session inactivity expiration time in seconds |
| `ALLOWED_ORIGINS` | Frontend origins permitted to access the backend |

## Project Structure

```text
PDF-QueryBOT/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── api.js
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── .gitignore
│
├── .gitignore
└── README.md
```

## Usage Instructions

1. Start the backend server.
2. Start the frontend development server.
3. Open the application in your browser.
4. Upload one or multiple PDF documents using the **Upload PDF** button.
5. Wait for the documents to be processed.
6. Enter a question in the chat input field.
7. Receive an answer generated using the relevant content from the uploaded documents.
8. Upload another set of PDFs to start a new document session.