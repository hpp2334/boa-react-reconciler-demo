// Local type definitions for VM package
import type { UINodeId, UINodeProps, UINodeType } from '@brrd/types'
export * from '@brrd/types'

export interface UITreeNode {
  id: UINodeId;
  type: UINodeType;
  props: UINodeProps;
  children: UITreeNode[];
  parent?: UITreeNode;
}

export interface UITree {
  nodes: Map<UINodeId, UITreeNode>;
}

// React Reconciler type definitions
export type Type = string;
export type Props = UINodeProps;
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
export type EventPriority = 0;