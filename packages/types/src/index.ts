import type React from "react";

// Node type identifiers
export type UINodeId = string;

// Node type definitions
export type UINodeType = 'rect' | 'text';

export interface UINodeProps {
    width?: number
    height?: number
    x?: number
    y?: number
    text?: string
    color?: string
    backgroundColor?: string
    children?: React.ReactNode[]
}
