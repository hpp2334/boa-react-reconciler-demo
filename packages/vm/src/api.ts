import type { UINodeId } from '@brrd/types';
import { UI } from './ui';
import React from 'react';

let ui: UI = null!

export const initialize = () => {
    const g = globalThis as any

    ui = new UI()
    g.React = React
}

export const createRoot = (): UINodeId => {
    return ui.createRoot()
}

export const removeRoot = (id: UINodeId) => {
    ui.clear(id)
}

export const render = (rootId: UINodeId) => {
    const el = React.createElement((globalThis as any)["App"])
    ui.render(rootId, el)
}

export const getDrawable = (rootId: UINodeId): string => {
    return JSON.stringify(ui.getDrawable(rootId))
}

export const emitClickEvent = (nodeId: UINodeId) => {
    ui.emitClickEvent(nodeId)
}