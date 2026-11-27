// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Login from './Login'

afterEach(cleanup)

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

  it('lets customers identify themselves by username or email', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    expect(screen.getByRole('textbox', { name: 'Tên đăng nhập hoặc email' })).toBeTruthy()
  })
})
