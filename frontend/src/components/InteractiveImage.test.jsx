// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import InteractiveImage from './InteractiveImage'

describe('InteractiveImage', () => {
  it('tilts with pointer movement and resets when the pointer leaves', () => {
    render(<InteractiveImage src="/serum.jpg" alt="Serum bottle" />)

    const image = screen.getByRole('img', { name: 'Serum bottle' })
    const frame = image.parentElement
    vi.spyOn(frame, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => ({})
    })

    const pointerMove = new MouseEvent('pointermove', {
      bubbles: true,
      clientX: 100,
      clientY: 0
    })
    Object.defineProperty(pointerMove, 'pointerType', { value: 'mouse' })
    fireEvent(frame, pointerMove)
    expect(frame.style.getPropertyValue('--tilt-x')).toBe('5deg')
    expect(frame.style.getPropertyValue('--tilt-y')).toBe('6deg')

    fireEvent.pointerLeave(frame)
    expect(frame.style.getPropertyValue('--tilt-x')).toBe('0deg')
    expect(frame.style.getPropertyValue('--tilt-y')).toBe('0deg')
  })
})
