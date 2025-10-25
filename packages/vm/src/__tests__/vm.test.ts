import { describe, it, expect, beforeEach } from 'vitest';
import { TreeManager } from '../tree';
import React from 'react';
import { VM } from '../vm';

describe('test vm', () => {
    it('case 1', () => {
        const vm = new VM()
        
        const element = React.createElement('rect', {
          width: 300,
          height: 300,
          children: [
            React.createElement('text', {
              text: 'Hello world'
            })
          ]
        })

        const rootId = vm.createRoot()
        vm.render(rootId, element)

        expect(vm.snapshot(rootId)).toMatchInlineSnapshot()
    })
})
