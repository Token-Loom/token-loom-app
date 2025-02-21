import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { useToast } from '../use-toast'
import type { ToastActionElement } from '../../types'

describe('useToast', () => {
  beforeEach(() => {
    // Clear all toasts before each test
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.dismiss()
    })
  })

  it('should add a toast with default properties', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({ title: 'Test Toast' })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0]).toMatchObject({
      title: 'Test Toast',
      open: true
    })
  })

  it('should add multiple toasts', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({ title: 'Toast 1' })
      result.current.toast({ title: 'Toast 2' })
    })

    const openToasts = result.current.toasts.filter(t => t.open)
    expect(openToasts).toHaveLength(2)
    expect(openToasts[0].title).toBe('Toast 2')
    expect(openToasts[1].title).toBe('Toast 1')
  })

  it('should dismiss a specific toast', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({ title: 'Toast 1' })
      result.current.toast({ title: 'Toast 2' })
    })

    const toastId = result.current.toasts[0].id

    act(() => {
      result.current.dismiss(toastId)
    })

    const openToasts = result.current.toasts.filter(t => t.open)
    expect(openToasts).toHaveLength(1)
    expect(openToasts[0].title).toBe('Toast 1')
  })

  it('should dismiss all toasts when no id is provided', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({ title: 'Toast 1' })
      result.current.toast({ title: 'Toast 2' })
    })

    act(() => {
      result.current.dismiss()
    })

    const openToasts = result.current.toasts.filter(t => t.open)
    expect(openToasts).toHaveLength(0)
  })

  it('should handle custom duration', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({
        title: 'Custom Duration Toast',
        duration: 10000
      })
    })

    expect(result.current.toasts[0].duration).toBe(10000)
  })

  it('should handle toast with action', () => {
    const { result } = renderHook(() => useToast())
    const action: ToastActionElement = {
      altText: 'Test Action',
      action: <button>Click me</button>
    }

    act(() => {
      result.current.toast({
        title: 'Toast with Action',
        action
      })
    })

    expect(result.current.toasts[0].action).toBe(action)
  })
})
