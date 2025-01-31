# PDF-QueryBOT

PDF-QueryBOT is a full-stack application designed to allow users to upload PDF documents and interact with them through natural language processing. Users can ask questions regarding the content of the uploaded PDFs, and the backend processes these documents to provide answers.

## Application Architecture

The application is built using a microservices architecture, with the following components:

- **Frontend**: Developed with React.js, providing a user interface for document upload and interaction.
- **Backend**: Built with FastAPI, handling PDF uploads, question processing, and answer retrieval.
- **NLP Processing**: Utilizes LangChain for processing natural language questions and generating answers from PDF content.

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/suhailskhan9/PDF-QueryBOT.git
   cd PDF-QueryBOT

2. **Install dependencies**:
   - For the backend (inside the backend directory):
   ```bash
   pip install -r requirements.txt
   ```
   - For the frontend (inside the frontend directory):
   ```bash
   npm install

3. **Start the backend server**:
   ```bash
   uvicorn main:app --reload

4. **Start the frontend application**:
   ```bash
   npm start

# API Documentation

## 1. Upload PDFs
Uploads PDF files, extracts text, splits it into chunks, and stores vector embeddings for retrieval.

### **Endpoint**
`POST /upload`

### **Request**
- **Content-Type:** `multipart/form-data`
- **Body Parameters:**

| Parameter  | Type               | Required | Description                  |
|------------|--------------------|----------|------------------------------|
| `files`    | `List[UploadFile]` | ✅ Yes   | List of PDF files to upload |

### **Response**
- **Success (200 OK)**
  ```json
  {
    "message": "PDFs uploaded and processed successfully"
  }
## 2. Ask a Question
Queries the stored PDFs for an answer based on stored embeddings.

### **Endpoint**
`POST /ask`

### **Request**
- **Content-Type:** `application/json`
- **Body Parameters:**

| Parameter  | Type   | Required | Description                    |
|------------|--------|----------|--------------------------------|
| `question` | `str` | ✅ Yes   | The question to ask based on uploaded PDFs |

### **Response**
- **Success (200 OK)**
  ```json
  {
    "answer": "Summarized response from the PDFs"
  }

