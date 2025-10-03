from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import openai
import os
import aiofiles
import tempfile
import shutil
from pathlib import Path
from typing import List, Optional
import json
import logging
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Meeting Action Assistant API",
    description="AI-powered meeting transcription and action item extraction",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    logger.warning("OPENAI_API_KEY not found in environment variables")

# Create uploads directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Pydantic models
class ActionItem(BaseModel):
    id: int
    task: str
    owner: str
    due: str

class MeetingAnalysis(BaseModel):
    summary: str
    action_items: List[ActionItem]

class TranscriptRequest(BaseModel):
    transcript: str

class UploadResponse(BaseModel):
    success: bool
    filename: Optional[str] = None
    error: Optional[str] = None

class TranscriptionResponse(BaseModel):
    success: bool
    transcript: Optional[str] = None
    error: Optional[str] = None

class ExtractionResponse(BaseModel):
    success: bool
    data: Optional[MeetingAnalysis] = None
    error: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    timestamp: str

# Helper functions
def cleanup_file(file_path: Path):
    """Clean up uploaded file after processing"""
    try:
        if file_path.exists():
            file_path.unlink()
            logger.info(f"Cleaned up file: {file_path}")
    except Exception as e:
        logger.error(f"Failed to cleanup file {file_path}: {e}")

def validate_file_type(filename: str) -> bool:
    """Validate if the uploaded file type is supported"""
    allowed_extensions = {
        '.mp3', '.wav', '.m4a', '.aac',  # Audio
        '.mp4', '.avi', '.mov', '.wmv', '.webm'  # Video
    }
    file_ext = Path(filename).suffix.lower()
    return file_ext in allowed_extensions

async def transcribe_audio(file_path: Path) -> str:
    """Transcribe audio file using OpenAI Whisper"""
    try:
        with open(file_path, "rb") as audio_file:
            response = openai.Audio.transcribe(
                model="whisper-1",
                file=audio_file,
                response_format="text"
            )
        return response
    except Exception as e:
        logger.error(f"Transcription failed: {e}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

async def extract_meeting_insights(transcript: str) -> MeetingAnalysis:
    """Extract meeting summary and action items using GPT-4"""
    try:
        prompt = f"""
        Analyze this meeting transcript and extract:
        1. A concise summary of the meeting (2-3 sentences)
        2. Action items with assigned owners and due dates

        For each action item, identify:
        - The specific task to be done
        - Who is responsible (owner)
        - When it's due (if mentioned, otherwise use "TBD")

        Meeting Transcript:
        {transcript}

        Please respond in JSON format:
        {{
            "summary": "Brief meeting summary here",
            "action_items": [
                {{
                    "id": 1,
                    "task": "Specific task description",
                    "owner": "Person's name or 'TBD'",
                    "due": "Due date or 'TBD'"
                }}
            ]
        }}
        """

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert meeting assistant that extracts key information from meeting transcripts."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1500
        )

        # Parse the JSON response
        content = response.choices[0].message.content
        analysis_data = json.loads(content)
        
        return MeetingAnalysis(**analysis_data)

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse GPT-4 response as JSON: {e}")
        # Fallback response
        return MeetingAnalysis(
            summary="Unable to generate summary - please try again",
            action_items=[]
        )
    except Exception as e:
        logger.error(f"Analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

# API Routes
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat()
    )

@app.post("/api/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    """Upload audio/video file for processing"""
    try:
        # Validate file type
        if not validate_file_type(file.filename):
            return UploadResponse(
                success=False,
                error="Unsupported file type. Please upload an audio or video file."
            )

        # Check file size (100MB limit)
        max_size = 100 * 1024 * 1024  # 100MB
        if file.size and file.size > max_size:
            return UploadResponse(
                success=False,
                error="File too large. Please upload a file smaller than 100MB."
            )

        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        file_path = UPLOAD_DIR / filename

        # Save uploaded file
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)

        logger.info(f"File uploaded successfully: {filename}")
        
        return UploadResponse(
            success=True,
            filename=filename
        )

    except Exception as e:
        logger.error(f"Upload failed: {e}")
        return UploadResponse(
            success=False,
            error=f"Upload failed: {str(e)}"
        )

@app.get("/api/transcribe/{filename}", response_model=TranscriptionResponse)
async def transcribe_file(filename: str, background_tasks: BackgroundTasks):
    """Transcribe uploaded audio/video file"""
    try:
        file_path = UPLOAD_DIR / filename
        
        if not file_path.exists():
            return TranscriptionResponse(
                success=False,
                error="File not found. Please upload the file first."
            )

        # Check OpenAI API key
        if not openai.api_key:
            return TranscriptionResponse(
                success=False,
                error="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable."
            )

        # Transcribe the file
        transcript = await transcribe_audio(file_path)
        
        # Schedule file cleanup
        background_tasks.add_task(cleanup_file, file_path)
        
        logger.info(f"Transcription completed for: {filename}")
        
        return TranscriptionResponse(
            success=True,
            transcript=transcript
        )

    except Exception as e:
        logger.error(f"Transcription failed for {filename}: {e}")
        return TranscriptionResponse(
            success=False,
            error=f"Transcription failed: {str(e)}"
        )

@app.post("/api/extract", response_model=ExtractionResponse)
async def extract_action_items(request: TranscriptRequest):
    """Extract meeting summary and action items from transcript"""
    try:
        if not request.transcript.strip():
            return ExtractionResponse(
                success=False,
                error="Empty transcript provided"
            )

        # Check OpenAI API key
        if not openai.api_key:
            return ExtractionResponse(
                success=False,
                error="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable."
            )

        # Extract insights
        analysis = await extract_meeting_insights(request.transcript)
        
        logger.info(f"Analysis completed - found {len(analysis.action_items)} action items")
        
        return ExtractionResponse(
            success=True,
            data=analysis
        )

    except Exception as e:
        logger.error(f"Extraction failed: {e}")
        return ExtractionResponse(
            success=False,
            error=f"Analysis failed: {str(e)}"
        )

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"success": False, "error": "Endpoint not found"}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": "Internal server error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=3001,
        reload=True,
        log_level="info"
    )