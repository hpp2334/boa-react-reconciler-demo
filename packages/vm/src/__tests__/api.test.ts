import { describe, it, expect, beforeEach } from 'vitest';
import { TreeManager } from '../tree';
import React, { act } from 'react';
import { VM } from '../vm';
import type { UINodeDrawable } from '@brrd/types';
import { createRoot, getDrawable, render } from '../api';


describe('api', () => {
    it('basic', () => {
        const id = createRoot()
        act(() => {
            render(id, 'return React.createElement("text", { text: "hello" })')
        })
        const s = getDrawable(id)

        expect(s).toMatchInlineSnapshot(`"{"id":"node_1761415394577_y3thw3e2t","type":"rect","props":{},"children":[{"id":"node_1761415394581_kfyinhoh1","type":"text","props":{"text":"hello"},"children":[]}]}"`)
    })
})
