from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
from pydantic import BaseModel
import os
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from langchain_google_genai.llms import GoogleGenerativeAI
from dotenv import load_dotenv
import json
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://pdf-query-bot.vercel.app"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



class QuestionRequest(BaseModel):
    question: str

def get_pdf_text(pdf_docs):
    text = ""
    for pdf in pdf_docs:
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks = text_splitter.split_text(text)
    return chunks

def get_vector_store(text_chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")

def get_conversational_chain():
    prompt_template = """
    Answer the question as detailed as possible from the provided context, make sure to provide all the details, if the answer is not in
    provided context just say, "answer is not available in the context", don't provide the wrong answer\n\n
    Context:\n {context}?\n
    Question: \n{question}\n

    Answer:
    """
    model = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
    return chain

@app.post("/upload")
async def upload_pdfs(files: List[UploadFile] = File(...)):
    pdf_docs = [file.file for file in files]
    text = get_pdf_text(pdf_docs)
    text_chunks = get_text_chunks(text)
    get_vector_store(text_chunks)
    return {"message": "PDFs uploaded and processed successfully"}

def summarize_answer(answer_text, context_text, model_name="gemini-pro"):
    model = GoogleGenerativeAI(model=model_name)
    prompt = f"Summarize the answer in a concise and informative way, highlighting the relevant parts of the context:\n\nAnswer: {answer_text}\n\nContext: {context_text}"
    prompt = [prompt]
    # summary = model.generate(prompt, temperature=0.7, max_length=200)
    # return summary[0]
    response = model.generate(prompt, temperature=0.7, max_length=2000)
    # Handle potential response structure variations
    result = response.generations
    print('result',result)
    raw_text = result[0][0].text
    clean_text = raw_text.replace('*', '')
    print('result[0].text ', clean_text)
    return clean_text


@app.post("/ask")
async def ask_question(question_request: QuestionRequest):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
    docs = vector_store.similarity_search(question_request.question)
    chain = get_conversational_chain()
    response = chain({"input_documents": docs, "question": question_request.question}, return_only_outputs=True)
    answer_text = response.get("output_text", "")
    print('answer_text', answer_text)
    context_text = response.get("context", "")  
    summary = summarize_answer(answer_text, context_text)
    return JSONResponse(content={"answer": summary})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
