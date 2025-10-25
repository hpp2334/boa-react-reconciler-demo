import { describe, it, expect } from 'vitest'
import { add } from '@brrd/core'

describe('@brrd/core add function in browser', () => {
  it('should add two positive numbers', () => {
    expect(add(2, 3)).toBe(5)
  })

  it('should add a positive and negative number', () => {
    expect(add(5, -2)).toBe(3)
  })

  it('should handle zero', () => {
    expect(add(0, 10)).toBe(10)
    expect(add(10, 0)).toBe(10)
  })

  it('should add negative numbers', () => {
    expect(add(-3, -4)).toBe(-7)
  })

  it('should handle decimal numbers', () => {
    expect(add(2.5, 3.7)).toBe(6.2)
  })

  it('should work in browser environment', () => {
    // Verify we're in a browser context
    expect(typeof window).toBe('object')
    expect(typeof document).toBe('object')

    // Verify the add function works as expected
    const result = add(100, 200)
    expect(result).toBe(300)
  })
})