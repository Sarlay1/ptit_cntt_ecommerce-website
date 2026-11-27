// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import BeautyHero from './BeautyHero'

vi.mock('../api/endpoints', () => ({
  heroBannerApi: {
    getActiveSlides: vi.fn().mockResolvedValue({ data: [] })
  }
}))

vi.mock('../context/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() })
}))

describe('BeautyHero carousel', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('moves between slides with the previous and next controls', async () => {
    render(<BeautyHero />)

    expect(screen.getByRole('group', { name: '1 / 3' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Ảnh tiếp theo' }))
    expect(await screen.findByRole('img', { name: 'Các sản phẩm chăm sóc da được sắp đặt tinh tế' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Ảnh trước' }))
    expect(screen.getByRole('group', { name: '1 / 3' })).toBeTruthy()
  })

  it('automatically advances every seven seconds', () => {
    vi.useFakeTimers()
    render(<BeautyHero />)

    act(() => {
      vi.advanceTimersByTime(7000)
    })

    expect(screen.getByRole('group', { name: '2 / 3' })).toBeTruthy()
  })
})
