// @vitest-environment jsdom

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import Login from './Login'

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login: vi.fn() })
}))

describe('Login', () => {
  it('clearly separates customer and Admin sign-in modes', () => {
    const { rerender } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Đăng nhập khách hàng' })).toBeTruthy()

    rerender(
      <MemoryRouter>
        <Login adminOnly />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'Đăng nhập quản trị' })).toBeTruthy()
  })
})
