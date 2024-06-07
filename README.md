# PDF-QueryBOT

PDF-QueryBOT is a full-stack application designed to allow users to upload PDF documents and interact with them through natural language processing. Users can ask questions regarding the content of the uploaded PDFs, and the backend processes these documents to provide answers.

## Application Architecture

The application is built using a microservices architecture, with the following components:

- **Frontend**: Developed with React.js, providing a user interface for document upload and interaction.
- **Backend**: Built with FastAPI, handling PDF uploads, question processing, and answer retrieval.
- **NLP Processing**: Utilizes LangChain/LLamaIndex for processing natural language questions and generating answers from PDF content.

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/suhailskhan9/PDF-QueryBOT.git
   cd PDF-QueryBOT

2. Install dependencies:
   - For the backend (inside the backend directory):
   ```bash
   pip install -r requirements.txt

   - For the frontend (inside the frontend directory):
   ```bash
   npm install

3. Start the backend server:
   ```bash
   uvicorn main:app --reload

4. Start the frontend application:
   ```bash
   npm start

## API Documentation
- Upload PDF:
   - Endpoint: /upload
   - Method: POST
   - Body: FormData with the PDF file
   - Response: JSON with the stored file metadata
- Ask Question:
  - Endpoint: /ask
  - Method: POST
  - Body: JSON with document_id and question
  - Response: JSON with the answer to the question
