import type React from "react";

// Node type identifiers
export type UINodeId = string;

// Node type definitions
export type UINodeType = 'row' | 'column' | 'text';

export interface UINodeProps {
    text?: string
    color?: string
    backgroundColor?: string
    gap?: number
    children?: React.ReactNode[]
}

export interface UINodeDrawable {
    id: UINodeId
    type: UINodeType
    props: UINodeProps
    children: UINodeDrawable[]
}