import type { UITreeNode, UITree, UINodeType, UINodeId, UINodeProps, UINodeDrawable } from './types';

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
    const index = parent.children.findIndex((child: UITreeNode) => child.id === childId);
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

  updateNodeProps(nodeId: UINodeId, props: UINodeProps): boolean {
    const node = this.tree.nodes.get(nodeId);
    if (!node) return false;

    node.props = { ...props };
    return true;
  }

  getNode(id: UINodeId): UITreeNode | undefined {
    return this.tree.nodes.get(id);
  }

  findNodeByType(type: string): UITreeNode[] {
    return Array.from(this.tree.nodes.values()).filter((node: UITreeNode) => node.type === type);
  }

  getTree(): UITree {
    return {
      nodes: new Map(this.tree.nodes)
    };
  }

  snapshot(nodeId: UINodeId): string {
      const node = this.tree.nodes.get(nodeId);
      if (!node) {
        return `Node ${nodeId} not found`;
      }
      return this.formatNode(node, 0);
  }

  getDrawable(nodeId: UINodeId): UINodeDrawable {
    const node = this.tree.nodes.get(nodeId);
    if (!node) {
      throw Error(`Node ${nodeId} not found`)
    }

    return this.convertToDrawable(node);
  }

  private convertToDrawable(node: UITreeNode): UINodeDrawable {
    const drawable: UINodeDrawable = {
      id: node.id,
      type: node.type,
      props: { ...node.props },
      children: []
    };

    // Convert children recursively
    for (const child of node.children) {
      drawable.children.push(this.convertToDrawable(child));
    }

    return drawable;
  }

  private formatNode(node: UITreeNode, indent: number): string {
    const spaces = '  '.repeat(indent);
    const propsStr = this.formatProps(node.props);
    const childrenStr = node.children.length > 0
      ? '\n' + node.children.map(child => this.formatNode(child, indent + 1)).join('\n')
      : '';

    return `${spaces}<${node.type}${propsStr}>${childrenStr}`;
  }

  private formatProps(props: UINodeProps): string {
    const entries: string[] = []
    const emit = (key: keyof UINodeProps) => {
      const value = props[key]
      if (value) {
        entries.push(`${key}=${JSON.stringify(value)}`)
      }
    }

    emit('x')
    emit('y')
    emit('width')
    emit('height')
    emit('backgroundColor')
    emit('color')
    emit('text')

    return entries.length > 0 ? ` ${entries.join(' ')}` : '';
  }

  private generateId(): UINodeId {
    return `node_${Math.random().toString(36).substring(2, 11)}` as UINodeId;
  }
}