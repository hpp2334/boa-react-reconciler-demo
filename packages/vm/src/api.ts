import type { UINodeId } from '@brrd/types';
import { VM } from './vm';
import React from 'react';

const vm = new VM()

export const createRoot = (): UINodeId => {
    return vm.createRoot()
}

export const render = (rootId: UINodeId, compiledCode: string) => {
    const f = new Function('React', compiledCode) as (r: typeof React) => React.ReactElement
    const el = f(React)
    vm.render(rootId, el)
}

export const getDrawable = (rootId: UINodeId): string => {
    return JSON.stringify(vm.getDrawable(rootId))
}
