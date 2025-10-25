export type UINodeId = string;
export type UINodeType = 'rect' | 'text';

export interface UITreeNode {
  id: UINodeId;
  type: UINodeType;
  props: Record<string, any>;
  children: UITreeNode[];
  parent?: UITreeNode;
}

export interface UITree {
  nodes: Map<UINodeId, UITreeNode>;
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

export type PublicRootInstance = UITreeNode;