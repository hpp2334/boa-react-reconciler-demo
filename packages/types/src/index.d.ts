import type React from "react";
export type UINodeId = string;
export type UINodeType = 'rect' | 'text';
export interface UINodeProps {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    text?: string;
    color?: string;
    backgroundColor?: string;
    children?: React.ReactNode[];
}
export interface UINodeDrawable {
    id: UINodeId;
    type: UINodeType;
    props: UINodeProps;
    children: UINodeDrawable[];
}
