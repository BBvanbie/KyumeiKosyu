import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { HomePage } from './HomePage'

vi.mock('../lib/api', () => ({
  api: {
    getHomeSiteContent: vi.fn().mockRejectedValue(new Error('unavailable')),
  },
}))

describe('HomePage', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    sessionStorage.clear()
  })

  it('renders the setup heading', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', {
        name: '予約したい講習日を選び、そのまま予約手続きへ進めます。',
      })
    ).toBeInTheDocument()
  })

  it('renders the reservation lookup CTA', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('link', {
        name: '予約を確認する',
      })
    ).toBeInTheDocument()
  })
})
