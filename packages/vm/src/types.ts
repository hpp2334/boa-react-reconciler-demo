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
export type Props = Object;
export type Container = UITreeNode | null;
export type Instance = UITreeNode;
export type TextInstance = UITreeNode;
export type SuspenseInstance = null;
export type HydratableInstance = Instance | TextInstance;
export type FormInstance = Instance;
export type PublicInstance = Instance;
export type HostContext = {
  isInAParentText: boolean,
};
export type ChildSet = void;
export type TimeoutHandle = number;
export type NoTimeout = -1;
export type TransitionStatus = 0;

export type PublicRootInstance = any; // Simplified for VM
export type EventPriority = 0; // Simplified for VM