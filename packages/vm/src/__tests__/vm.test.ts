import { describe, it, expect, beforeEach } from 'vitest';
import { TreeManager } from '../tree';
import React, { act } from 'react';
import { VM } from '../vm';

describe('test vm', () => {
  it('case 1', () => {
    const vm = new VM()

    const element = React.createElement('rect', {
      width: 300,
      height: 300,
    }, [
      React.createElement('text', {
        text: 'Hello world'
      })
    ])

    const rootId = vm.createRoot()
    act(() => {
      vm.render(rootId, element)
    })

    expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
      "<rect>
        <rect width=300 height=300 children=[{"type":"text","key":null,"props":{"text":"Hello world"},"_owner":null,"_store":{}}]>
          <text text="Hello world">"
    `)
  })
})
