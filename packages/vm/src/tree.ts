import type {
  UITreeNode,
  UITree,
  UINodeType,
  UINodeId,
  UINodeProps,
  UINodeDrawable,
} from "./types";

export class TreeManager {
  private tree: UITree = {
    nodes: new Map(),
  };

  createNode(type: UINodeType, props: UINodeProps = {}): UITreeNode {
    const node: UITreeNode = {
      id: this.generateId(),
      type,
      props: { ...props },
      children: [],
    };

    this.tree.nodes.set(node.id, node);
    return node;
  }

  addChild(parent: UITreeNode, child: UITreeNode): void {
    child.parent = parent;
    parent.children.push(child);
  }

  removeChild(parent: UITreeNode, childId: UINodeId): boolean {
    const index = parent.children.findIndex(
      (child: UITreeNode) => child.id === childId,
    );
    if (index !== -1) {
      const removed = parent.children[index];
      if (removed) {
        parent.children.splice(index, 1);
        removed.parent = undefined;
        this.tree.nodes.delete(childId);
      }
      return true;
    }
    return false;
  }

  removeNode(nodeId: UINodeId): boolean {
    const node = this.tree.nodes.get(nodeId);
    if (!node) return false;

    // Remove from parent if exists
    if (node.parent) {
      this.removeChild(node.parent, nodeId);
    }

    // Recursively remove all children
    const removeRecursive = (n: UITreeNode) => {
      n.children.forEach((child) => {
        removeRecursive(child);
      });
      this.tree.nodes.delete(n.id);
    };

    removeRecursive(node);
    return true;
  }

  updateNodeProps(nodeId: UINodeId, props: UINodeProps): boolean {
    const node = this.tree.nodes.get(nodeId);
    if (!node) return false;

    node.props = { ...props };
    return true;
  }

  triggerClickEvent(nodeId: UINodeId) {
    const node = this.tree.nodes.get(nodeId);
    if (!node) {
      return;
    }
    node.props.onClick?.();
  }

  triggerInputEvent(nodeId: UINodeId, value: string) {
    const node = this.tree.nodes.get(nodeId);
    if (!node) {
      return;
    }
    node.props.onInput?.(value);
  }

  getNode(id: UINodeId): UITreeNode | undefined {
    return this.tree.nodes.get(id);
  }

  getTree(): UITree {
    return {
      nodes: new Map(this.tree.nodes),
    };
  }

  getDrawable(nodeId: UINodeId): UINodeDrawable {
    const node = this.tree.nodes.get(nodeId);
    if (!node) {
      throw Error(`Node ${nodeId} not found`);
    }

    return this.convertToDrawable(node);
  }

  private convertToDrawable(node: UITreeNode): UINodeDrawable {
    const drawable: UINodeDrawable = {
      id: node.id,
      type: node.type,
      parentType: node.parent?.type || null,
      props: { ...node.props, hasClickHandler: Boolean(node.props.onClick), hasInputHandler: Boolean(node.props.onInput) },
      children: [],
    };

    // Convert children recursively
    for (const child of node.children) {
      drawable.children.push(this.convertToDrawable(child));
    }

    return drawable;
  }

  private generateId(): UINodeId {
    return `node_${Math.random().toString(36).substring(2, 11)}` as UINodeId;
  }
}
