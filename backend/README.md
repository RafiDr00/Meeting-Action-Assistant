# Meeting Action Assistant - Backend

FastAPI backend server for the Meeting Action Assistant application.

## Features

- File upload handling (audio/video files up to 100MB)
- OpenAI Whisper integration for transcription
- OpenAI GPT-4 integration for meeting analysis
- Automatic action item extraction
- RESTful API with proper error handling
- CORS support for frontend integration

## Setup

### Prerequisites

- Python 3.8 or higher
- OpenAI API key

### Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

### Running the Server

```bash
# Development mode (with auto-reload)
python main.py

# Or using uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 3001 --reload
```

The server will start on `http://localhost:3001`

## API Endpoints

### Upload File
```
POST /api/upload
Content-Type: multipart/form-data

Body: file (audio/video file)
Response: {"success": true, "filename": "uploaded_filename"}
```

### Transcribe File
```
GET /api/transcribe/{filename}
Response: {"success": true, "transcript": "transcribed text"}
```

### Extract Action Items
```
POST /api/extract
Content-Type: application/json

Body: {"transcript": "meeting transcript text"}
Response: {
  "success": true,
  "data": {
    "summary": "Meeting summary",
    "action_items": [
      {
        "id": 1,
        "task": "Task description",
        "owner": "Person name",
        "due": "Due date"
      }
    ]
  }
}
```

### Health Check
```
GET /health
Response: {"status": "healthy", "timestamp": "2025-10-03T10:00:00"}
```

## Supported File Formats

- **Audio**: MP3, WAV, M4A, AAC
- **Video**: MP4, AVI, MOV, WMV, WEBM
- **Max size**: 100MB

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error description"
}
```

Common error scenarios:
- Unsupported file format (415)
- File too large (413)
- Missing OpenAI API key (500)
- File not found (404)
- Transcription/analysis failures (500)

## Development

### Project Structure

```
backend/
├── main.py              # FastAPI application
├── requirements.txt     # Python dependencies
├── .env.example        # Environment variables template
├── .env                # Environment variables (not in git)
├── .gitignore          # Git ignore rules
├── uploads/            # Temporary file storage (auto-created)
└── README.md           # This file
```

### Adding New Features

1. Add new route handlers in `main.py`
2. Define Pydantic models for request/response validation
3. Update API documentation in this README
4. Test with the frontend application

### Logging

The application uses Python's built-in logging module. Logs include:
- File upload/processing events
- API request/response information
- Error details for debugging

## Security Notes

- Files are automatically deleted after processing
- CORS is configured for localhost:3000 only
- File type validation prevents malicious uploads
- File size limits prevent DoS attacks
- Sensitive data (API keys) stored in environment variables

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Ensure `.env` file exists with valid `OPENAI_API_KEY`

2. **"File not found"**
   - Check if uploads directory exists and has write permissions

3. **"CORS errors"**
   - Ensure frontend is running on http://localhost:3000

4. **"Connection refused"**
   - Verify backend is running on port 3001
   - Check firewall settings

### Debug Mode

Run with debug logging:
```bash
LOG_LEVEL=DEBUG python main.py
```