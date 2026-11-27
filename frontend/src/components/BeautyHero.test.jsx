// @vitest-environment jsdom

import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import BeautyHero from './BeautyHero'

describe('BeautyHero carousel', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('moves between slides with the previous and next controls', () => {
    render(<BeautyHero />)

    expect(screen.getByRole('group', { name: '1 / 3' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Ảnh tiếp theo' }))
    expect(screen.getByRole('img', { name: 'Bộ mỹ phẩm trang điểm' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Ảnh trước' }))
    expect(screen.getByRole('group', { name: '1 / 3' })).toBeTruthy()
  })

  it('automatically advances every two seconds', () => {
    vi.useFakeTimers()
    render(<BeautyHero />)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.getByRole('group', { name: '2 / 3' })).toBeTruthy()
  })
})
