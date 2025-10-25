import { describe, it, expect } from 'vitest'
import { add, testCx } from '@brrd/core'

describe('@brrd/core add function in browser', () => {
  it('test', () => {
    expect(testCx()).toBe("")
  })
})