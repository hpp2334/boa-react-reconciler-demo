import type React from "react";

// Node type identifiers
export type UINodeId = string;

// Node type definitions
export type UINodeType = 'row' | 'column' | 'padding' | 'box' | 'text';

export interface UINodeProps {
    // text
    text?: string
    fontSize?: number
    fontWeight?: number
    // column, row
    gap?: number
    mainAlignment?: 'start' | 'center' | 'end'
    crossAlignment?: 'start' | 'center' | 'end'
    // container (expect for text)
    backgroundColor?: string
    children?: React.ReactNode[]
    // padding
    top?: number
    bottom?: number
    left?: number
    right?: number
    // all
    width?: string
    height?: string
    color?: string
    offsetTop?: number
    offsetBottom?: number
    offsetLeft?: number
    offsetRight?: number
}

// parentType === 'box', then position is `absolute`
export type UINodeDrawable = {
    id: UINodeId
    type: UINodeType
    parentType: UINodeType | null
    props: UINodeProps
    children: UINodeDrawable[]
}