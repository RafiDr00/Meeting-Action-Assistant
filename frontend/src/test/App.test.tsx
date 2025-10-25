import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

// Mock the API module with hoisted references so Vitest can access them during mock evaluation
const apiMocks = vi.hoisted(() => ({
  uploadFile: vi.fn(),
  transcribeFile: vi.fn(),
  extractActionItems: vi.fn(),
}))

vi.mock('../services/api', () => apiMocks)

const {
  uploadFile: mockUploadFile,
  transcribeFile: mockTranscribeFile,
  extractActionItems: mockExtractActionItems,
} = apiMocks

const renderAndEnterApp = async () => {
  const user = userEvent.setup()
  render(<App />)
  const launchButton = await screen.findByRole('button', { name: /launch app/i })
  await user.click(launchButton)
  return user
}

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the cinematic landing experience by default', () => {
    render(<App />)

    expect(screen.getByText(/Meeting AI/i)).toBeInTheDocument()
    expect(screen.getByText(/Transform Your/i)).toBeInTheDocument()
  })

  it('displays the dashboard after entering the app', async () => {
    await renderAndEnterApp()

    expect(screen.getByText(/Dashboard Overview/i)).toBeInTheDocument()
    expect(screen.getByText(/Quick Actions/i)).toBeInTheDocument()
  })

  it('can switch between different views', async () => {
    const user = await renderAndEnterApp()

    const [meetingsNav] = screen.getAllByRole('button', { name: /Meetings/i })
    await user.click(meetingsNav)

    expect(screen.getByText(/Q4 Planning Session/i)).toBeInTheDocument()
  })

  it('handles dark mode toggle', async () => {
    const user = await renderAndEnterApp()

    const darkModeToggle = screen.getByLabelText(/toggle dark mode/i)
    await user.click(darkModeToggle)
    
    // Check if dark mode class is applied
    const appContainer = document.querySelector('.dark')
    expect(appContainer).toBeInTheDocument()
  })

  it('shows error message when API calls fail', async () => {
    // Mock API failure
  mockUploadFile.mockRejectedValue(new Error('Network error'))

  const user = await renderAndEnterApp()
    
    // Try to upload a file
    const fileInput = screen.getByLabelText(/upload/i)
    const file = new File(['test content'], 'test.mp3', { type: 'audio/mpeg' })

  await user.upload(fileInput, file)
    
    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('processes file upload workflow successfully', async () => {
    // Mock successful API responses
    mockUploadFile.mockResolvedValue({ success: true, filename: 'test.mp3' })
    mockTranscribeFile.mockResolvedValue({ 
      success: true, 
      transcript: 'Test meeting transcript' 
    })
    mockExtractActionItems.mockResolvedValue({
      success: true,
      data: {
        summary: 'Test meeting summary',
        action_items: [
          {
            id: 1,
            task: 'Test task',
            owner: 'John Doe',
            due: '2024-01-15'
          }
        ]
      }
    })

  const user = await renderAndEnterApp()
    
    // Upload a file
    const fileInput = screen.getByLabelText(/upload/i)
    const file = new File(['test content'], 'test.mp3', { type: 'audio/mpeg' })

    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(mockUploadFile).toHaveBeenCalledWith(file, expect.any(Function))
      expect(mockTranscribeFile).toHaveBeenCalledWith('test.mp3')
      expect(mockExtractActionItems).toHaveBeenCalledWith('Test meeting transcript')
    })

    await waitFor(() => {
      expect(screen.getByText(/Upload Meeting/i)).toBeInTheDocument()
    })
  })
})