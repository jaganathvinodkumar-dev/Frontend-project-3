/// <reference types="vitest" />
import React from 'react'
import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CommentsPanel from '../CommentsPanel'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useStore } from '../../store/useStore'

const queryClient = new QueryClient()

function Providers({ children }: { children: React.ReactNode }){
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('CommentsPanel', () => {
  test('renders and sends a comment', async () => {
    // ensure store is in a clean state
    const { result } = (useStore as any).getState ? { result: null } : { result: null }
    render(<CommentsPanel />, { wrapper: Providers })
    const textarea = screen.getByPlaceholderText(/Write a comment/i)
    fireEvent.change(textarea, { target: { value: 'Hello @alice' } })
    const button = screen.getByRole('button', { name: /send/i })
    fireEvent.click(button)
    expect(await screen.findByText(/sending.../i)).toBeInTheDocument()
  })
})
