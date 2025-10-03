# Meeting Action Assistant

AI-powered meeting transcription and action item extraction tool. Transform your meeting recordings into actionable insights with automatic transcription, intelligent summaries, and structured action items.

## Features

- 🎤 **Audio/Video Upload**: Support for multiple formats (MP3, WAV, M4A, AAC, MP4, AVI, MOV, WMV, WEBM)
- 🗣️ **AI Transcription**: Convert speech to text using OpenAI Whisper
- 📝 **Meeting Summaries**: AI-generated intelligent meeting overviews
- ✅ **Action Item Extraction**: Automatically identify tasks, owners, and due dates
- 👍 **Review & Approval**: Select which action items to approve and export
- 📁 **Export Options**: Download approved items as JSON or copy to clipboard
- 🔒 **Secure Processing**: Files are processed securely and deleted after analysis

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Vite for build tooling
- Axios for API communication
- React Dropzone for file uploads
- Lucide React for icons

### Backend (Required)
- FastAPI (Python)
- OpenAI API (Whisper + GPT-4)
- File handling for audio/video processing
- Multipart form data support

## Setup

### Quick Start

**Option 1: Automated Setup (Recommended)**
```bash
# Windows
setup.bat

# macOS/Linux
chmod +x setup.sh && ./setup.sh
```

**Option 2: NPM Script**
```bash
npm run setup
```

**Start Development Servers**
```bash
# Windows
dev.bat

# macOS/Linux
chmod +x dev.sh && ./dev.sh

# Or using npm
npm run dev:full
```

**Open the application**: http://localhost:3000

### Detailed Setup

#### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The frontend will be available at `http://localhost:3000`

#### Backend Setup (Required)

The backend is included in the `backend/` directory. To set it up:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. **Automated Setup** (Recommended):
   ```bash
   # Windows
   start.bat
   
   # macOS/Linux
   chmod +x start.sh
   ./start.sh
   ```

3. **Manual Setup**:
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   
   # Start the server
   python main.py
   ```

4. **Configure OpenAI API Key**:
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key: `OPENAI_API_KEY=your_key_here`
   - Get an API key from: https://platform.openai.com/api-keys

The backend will run on `http://localhost:3001` and provides the following API endpoints:

#### Required API Endpoints

- `POST /api/upload` - Upload audio/video files
  - Request: Multipart form data with `file`
  - Response: `{ success: boolean, filename?: string, error?: string }`

- `GET /api/transcribe/:filename` - Transcribe uploaded file
  - Response: `{ success: boolean, transcript?: string, error?: string }`

- `POST /api/extract` - Extract action items from transcript
  - Request: `{ transcript: string }`
  - Response: `{ success: boolean, data?: MeetingAnalysis, error?: string }`

- `GET /api/health` - Health check endpoint
  - Response: `{ status: string }`

#### Backend Implementation Example

```python
# requirements.txt
fastapi==0.104.1
uvicorn==0.24.0
openai==1.3.0
python-multipart==0.0.6
python-dotenv==1.0.0

# main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

# Implement your endpoints here...
```

#### Environment Variables

Create a `.env` file in your backend directory:
```
OPENAI_API_KEY=your_openai_api_key_here
```

## Usage

1. **Start both servers**: Frontend (port 3000) and Backend (port 3001)
2. **Upload a meeting recording**: Drag & drop or click to select audio/video files
3. **Wait for processing**: The system will automatically:
   - Upload your file
   - Transcribe the audio
   - Extract meeting summary and action items
4. **Review results**: View the transcript, summary, and extracted action items
5. **Approve items**: Select which action items to approve
6. **Export**: Download approved items as JSON or copy to clipboard

## Supported File Formats

- **Audio**: MP3, WAV, M4A, AAC
- **Video**: MP4, AVI, MOV, WMV, WEBM
- **Max file size**: 100MB

## Data Types

```typescript
interface ActionItem {
  id: number;
  task: string;
  owner: string;
  due: string;
}

interface MeetingAnalysis {
  summary: string;
  action_items: ActionItem[];
}
```

## Development

### Build for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Preview Production Build
```bash
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 