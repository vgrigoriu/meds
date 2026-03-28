import { act, fireEvent, render, screen } from '@testing-library/react'
import { UndoToast } from './UndoToast'

describe('UndoToast', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('auto-dismisses after the configured duration', () => {
    const onDismiss = jest.fn()

    render(
      <UndoToast
        message="Medicament șters"
        duration={100}
        onDismiss={onDismiss}
      />
    )

    expect(screen.getByText('Medicament șters')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(350)
    })

    expect(screen.queryByText('Medicament șters')).not.toBeInTheDocument()
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('dismisses when the close button is clicked', () => {
    const onDismiss = jest.fn()

    render(
      <UndoToast
        message="Medicament șters"
        onDismiss={onDismiss}
      />
    )

    const buttons = screen.getAllByRole('button')
    const dismissButton = buttons[1]

    fireEvent.click(dismissButton)

    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(screen.queryByText('Medicament șters')).not.toBeInTheDocument()
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('calls onUndo when the undo button is clicked', () => {
    const onUndo = jest.fn()
    const onDismiss = jest.fn()

    render(
      <UndoToast
        message="Medicament șters"
        onUndo={onUndo}
        onDismiss={onDismiss}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Anulează' }))

    act(() => {
      jest.advanceTimersByTime(200)
    })

    expect(screen.queryByText('Medicament șters')).not.toBeInTheDocument()
    expect(onUndo).toHaveBeenCalledTimes(1)
    expect(onDismiss).not.toHaveBeenCalled()
  })
})
