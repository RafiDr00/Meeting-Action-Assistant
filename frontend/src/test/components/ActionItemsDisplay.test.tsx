import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ActionItemsDisplay from '../../components/ActionItemsDisplay'
import { ActionItem } from '../../types'

describe('ActionItemsDisplay Component', () => {
  const mockActionItems: ActionItem[] = [
    {
      id: 1,
      task: 'Review quarterly budget',
      owner: 'John Doe',
      due: '2024-01-15',
      status: 'pending',
      priority: 'high',
      confidence: 0.9
    },
    {
      id: 2,
      task: 'Update documentation',
      owner: 'Jane Smith',
      due: '2024-01-20',
      status: 'completed',
      priority: 'medium',
      confidence: 0.85
    }
  ]

  const mockProps = {
    actionItems: mockActionItems,
    approvedItems: new Set<number>(),
    onToggleApproval: vi.fn()
  }

  it('renders action items correctly', () => {
    render(<ActionItemsDisplay {...mockProps} />)
    
    expect(screen.getByText('Review quarterly budget')).toBeInTheDocument()
    expect(screen.getByText('Update documentation')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('displays owner and due metadata for each action item', () => {
    render(<ActionItemsDisplay {...mockProps} />)

    expect(screen.getAllByText(/Owner:/i)).toHaveLength(mockActionItems.length)
    expect(screen.getAllByText(/Due:/i)).toHaveLength(mockActionItems.length)
  })

  it('shows empty state when no action items', () => {
    const emptyProps = { ...mockProps, actionItems: [] }
    render(<ActionItemsDisplay {...emptyProps} />)
    
    expect(screen.getByText(/no action items/i)).toBeInTheDocument()
  })

  it('shows approved state when an item is selected', () => {
    const approvedProps = {
      ...mockProps,
      approvedItems: new Set<number>([1])
    }

    render(<ActionItemsDisplay {...approvedProps} />)

    const approvedBadges = screen.getAllByText((content) => content.trim() === 'Approved')
    expect(approvedBadges.length).toBeGreaterThan(0)
  })

  it('can copy approved action items to clipboard', async () => {
    const user = userEvent.setup()

    const mockWriteText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator as any, 'clipboard', {
      value: { writeText: mockWriteText },
      configurable: true,
    })

    const approvedProps = {
      ...mockProps,
      approvedItems: new Set<number>([1])
    }

    render(<ActionItemsDisplay {...approvedProps} />)

    const copyButton = screen.getByRole('button', { name: /copy json/i })
    await user.click(copyButton)

    expect(mockWriteText).toHaveBeenCalledTimes(1)

    delete (window.navigator as any).clipboard
  })
})