import type { UITreeNode, UITree, UINodeType, UINodeId } from './types';

export class TreeManager {
  private tree: UITree = {
    nodes: new Map(),
  };

  createNode(type: UINodeType, props: Record<string, any> = {}): UITreeNode {
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
    const index = parent.children.findIndex(child => child.id === childId);
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
      n.children.forEach(child => {
        removeRecursive(child);
      });
      this.tree.nodes.delete(n.id);
    };

    removeRecursive(node);
    return true;
  }

  updateNodeProps(nodeId: UINodeId, props: Record<string, any>): boolean {
    const node = this.tree.nodes.get(nodeId);
    if (!node) return false;

    node.props = { ...props };
    return true;
  }

  findNode(id: UINodeId): UITreeNode | undefined {
    return this.tree.nodes.get(id);
  }

  findNodeByType(type: string): UITreeNode[] {
    return Array.from(this.tree.nodes.values()).filter(node => node.type === type);
  }

  getTree(): UITree {
    return { ...this.tree };
  }

  private generateId(): UINodeId {
    return `node_${Date.now()}_${Math.random().toString(36).substring(2, 11)}` as UINodeId;
  }
}