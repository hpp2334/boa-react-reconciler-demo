import { describe, it, expect } from 'vitest'
import { JsRuntime } from '@brrd/core'

describe('@brrd/core add function in browser', () => {
  it('test', () => {
    const rt = new JsRuntime()
    const id = rt.createRoot()
    rt.render(id, `
<text text="123" />      
`)
//     const drawable = rt.getDrawable(id)
//     expect(drawable).toMatchInlineSnapshot()
  })
})