export type UINodeType = 'rect' | 'text';

export interface UITreeNode {
  id: string;
  type: UINodeType;
  props: Record<string, any>;
  children: UITreeNode[];
  parent?: UITreeNode;
}

export interface UITree {
  root: UITreeNode | null;
  nodes: Map<string, UITreeNode>;
}

// ReactReconciler type definitions
export type Type = string;
export type Props = Record<string, any>;
export type Container = UITreeNode | null;
export type Instance = UITreeNode;
export type TextInstance = UITreeNode;
export type SuspenseInstance = null;
export type HydratableInstance = null;
export type FormInstance = null;
export type PublicInstance = UITreeNode;
export type HostContext = {};
export type ChildSet = null;
export type TimeoutHandle = number
export type NoTimeout = -1;
export type TransitionStatus = 0;