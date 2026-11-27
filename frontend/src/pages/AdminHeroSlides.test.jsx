// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AdminHeroSlides from './AdminHeroSlides'
import { adminApi } from '../api/endpoints'

vi.mock('../api/endpoints', () => ({
  adminApi: {
    getBannerSlides: vi.fn(),
    createBannerSlide: vi.fn(),
    updateBannerSlide: vi.fn(),
    deleteBannerSlide: vi.fn(),
    uploadImage: vi.fn()
  }
}))

vi.mock('../context/ToastContext', () => ({
  useToast: () => ({ showToast: vi.fn() })
}))

const slide = {
  id: 4,
  title: 'The daily edit',
  subtitle: 'Curated skincare essentials',
  imageUrl: 'https://example.com/banner.jpg',
  imageAlt: 'Skincare products',
  caption: 'Lumi Beauty',
  ctaLabel: 'Shop now',
  ctaLink: '/#catalog',
  displayOrder: 0,
  active: true
}

afterEach(cleanup)

describe('AdminHeroSlides', () => {
  beforeEach(() => {
    vi.mocked(adminApi.getBannerSlides).mockResolvedValue({ data: [slide] })
  })

  it('lists saved slides and opens their editor', async () => {
    render(<AdminHeroSlides />)

    expect(await screen.findByRole('heading', { name: 'The daily edit' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Chỉnh sửa' }))

    expect(screen.getByRole('heading', { name: 'Chỉnh sửa banner' })).toBeTruthy()
    expect(screen.getByDisplayValue('The daily edit')).toBeTruthy()
    expect(screen.getByDisplayValue('/#catalog')).toBeTruthy()
  })
})
