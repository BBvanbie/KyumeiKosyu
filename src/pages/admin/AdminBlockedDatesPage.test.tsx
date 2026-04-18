import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminBlockedDatesPage } from './AdminBlockedDatesPage'

const apiMock = vi.hoisted(() => ({
  getBlockedDates: vi.fn(),
  createBlockedDate: vi.fn(),
  deleteBlockedDates: vi.fn(),
}))

vi.mock('../../lib/api', () => ({
  api: apiMock,
}))

describe('AdminBlockedDatesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiMock.getBlockedDates.mockResolvedValue([
      {
        id: 'blocked-1',
        date: '2026-04-20T00:00:00.000Z',
        reason: '署行事',
      },
      {
        id: 'blocked-2',
        date: '2026-04-21T00:00:00.000Z',
        reason: '指導員不足',
      },
    ])
    apiMock.createBlockedDate.mockResolvedValue({
      id: 'blocked-3',
      date: '2026-04-22T00:00:00.000Z',
      reason: '署行事',
    })
    apiMock.deleteBlockedDates.mockResolvedValue({ deletedCount: 2 })
  })

  afterEach(() => {
    cleanup()
  })

  it('removes the old period form and shows multi-select controls', async () => {
    render(<AdminBlockedDatesPage />)

    expect(await screen.findByRole('heading', { name: '日付を選択して予約不可を登録・解除' })).toBeInTheDocument()
    expect(screen.queryByText('期間指定')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '複数選択' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '登録する' })).toBeDisabled()
  })

  it('can remove a blocked date from the registered list', async () => {
    render(<AdminBlockedDatesPage />)

    await screen.findByText('2026-04-20')
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])
    fireEvent.click(checkboxes[1])

    fireEvent.click(screen.getByRole('button', { name: '選択日を解除する' }))

    expect(
      await screen.findByRole('heading', { name: '2日を予約可能に戻す' })
    ).toBeInTheDocument()

    const dialog = screen.getByRole('dialog')
    fireEvent.click(within(dialog).getByRole('button', { name: '解除する' }))

    await waitFor(() => {
      expect(apiMock.deleteBlockedDates).toHaveBeenCalledWith({
        dates: ['2026-04-20', '2026-04-21'],
      })
    })
  })
})
