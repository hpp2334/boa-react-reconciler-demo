import React from 'react';
import ReactReconciler, { type Reconciler } from 'react-reconciler';
import { TreeManager } from './tree';
import type {
  UINodeId,
  UITreeNode,
  UINodeType,
  UINodeProps,
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  SuspenseInstance,
  HydratableInstance,
  FormInstance,
  PublicInstance,
  HostContext,
  ChildSet,
  TimeoutHandle,
  NoTimeout,
  TransitionStatus
} from './types';

declare const setTimeout: (fn: (...args: any[]) => any, ms: number) => number
declare const clearTimeout: (handle: number) => void

export class VM {
  private treeManager: TreeManager;
  private reconciler!: Reconciler<Container, Instance, TextInstance, SuspenseInstance, FormInstance, PublicInstance>;
  private currentUpdatePriority: ReactReconciler.EventPriority = 0;

  constructor() {
    this.treeManager = new TreeManager();
    this.setupReconciler();
  }

  private setupReconciler(): void {
    this.reconciler = ReactReconciler<Type,
      Props,
      Container,
      Instance,
      TextInstance,
      SuspenseInstance,
      HydratableInstance,
      FormInstance,
      PublicInstance,
      HostContext,
      ChildSet,
      TimeoutHandle,
      NoTimeout,
      TransitionStatus
    >({
      // Required methods
      getRootHostContext: (): HostContext => ({ isInAParentText: false }),
      getChildHostContext: (): HostContext => ({ isInAParentText: false }),
      prepareForCommit: () => null,
      resetAfterCommit: () => { },
      createInstance: (
        type: Type,
        props: Props,
        _rootContainer: Container,
        _hostContext: HostContext,
        _internalHandle: any
      ): Instance => {
        const nodeType = this.getNodeType(type);
        return this.treeManager.createNode(nodeType, props);
      },
      appendInitialChild: (parent: Instance, child: Instance): void => {
        this.treeManager.addChild(parent, child);
      },
      appendChild: (parent: Instance, child: Instance): void => {
        this.treeManager.addChild(parent, child);
      },
      appendChildToContainer: (container: Container, child: Instance): void => {
        if (container) {
          this.treeManager.addChild(container, child);
        }
      },
      finalizeInitialChildren: () => false,
      commitUpdate: (
        instance: Instance,
        _type: Type,
        _oldProps: Props,
        newProps: Props,
        _internalHandle: any
      ): void => {
        this.treeManager.updateNodeProps(instance.id, newProps);
      },
      commitMount: () => { },
      getPublicInstance: (instance: Instance): PublicInstance => instance,

      // Text handling
      shouldSetTextContent: (_type: Type, _props: Props): boolean => {
        return false;
      },
      createTextInstance: (
        text: string,
        _rootContainer: Container,
        _hostContext: HostContext,
        _internalHandle: any
      ): TextInstance => {
        return this.treeManager.createNode('text', { text: String(text) });
      },
      commitTextUpdate: (textInstance: TextInstance, _oldText: string, newText: string): void => {
        this.treeManager.updateNodeProps(textInstance.id, { text: String(newText) });
      },

      // Optional mutation methods
      removeChild: (parent: Instance, child: Instance): void => {
        this.treeManager.removeChild(parent, child.id);
      },
      removeChildFromContainer: (container: Container, child: Instance): void => {
        if (container) {
          this.treeManager.removeChild(container, child.id);
        }
      },
      insertBefore: (parent: Instance, child: Instance, beforeChild: Instance): void => {
        const index = parent.children.findIndex((c: Instance) => c.id === beforeChild.id);
        if (index !== -1) {
          child.parent = parent;
          parent.children.splice(index, 0, child);
        }
      },

      // Required methods with minimal implementations
      preparePortalMount: () => { },
      scheduleTimeout: (fn: () => void, delay: number): TimeoutHandle => setTimeout(fn, delay),
      cancelTimeout: (id: TimeoutHandle): void => clearTimeout(id),
      noTimeout: -1 as NoTimeout,
      isPrimaryRenderer: true,
      warnsIfNotActing: false,
      supportsHydration: false,
      supportsPersistence: false,
      supportsMutation: true,

      // Additional required methods
      getInstanceFromNode: () => null,
      beforeActiveInstanceBlur: () => { },
      afterActiveInstanceBlur: () => { },
      prepareScopeUpdate: () => { },
      getInstanceFromScope: () => null,
      detachDeletedInstance: () => { },
      getCurrentUpdatePriority: () => this.currentUpdatePriority,
      setCurrentUpdatePriority: (newPriority: ReactReconciler.EventPriority): void => {
        this.currentUpdatePriority = newPriority;
      },
      resetFormInstance: () => { },
      requestPostPaintCallback: () => { },
      NotPendingTransition: null,
      HostTransitionContext: null as any,
      resolveUpdatePriority: (): ReactReconciler.EventPriority => {
        if (this.currentUpdatePriority !== 0) {
          return this.currentUpdatePriority;
        }
        return 1; // DefaultEventPriority
      },
      shouldAttemptEagerTransition: function (): boolean {
        return false
      },
      trackSchedulerEvent: function (): void {
      },
      resolveEventType: function (): null | string {
        return null
      },
      resolveEventTimeStamp: function (): number {
        return 0
      },
      maySuspendCommit: function (_type: string, _props: Props): boolean {
        return false
      },
      preloadInstance: function (_type: string, _props: Props): boolean {
        return false
      },
      startSuspendingCommit: function (): void {
      },
      suspendInstance: function (_type: string, _props: Props): void {
      },
      waitForCommitToBeReady: function () {
        return null
      }
    });
  }

  private getNodeType(type: string): UINodeType {
    if (type === 'text') return 'text';
    if (type === 'rect') return 'rect';
    return 'rect'; // Default to rect for other elements
  }

  createRoot(): UINodeId {
    return this.treeManager.createNode('rect', {}).id
  }

  render(container: UITreeNode, element: React.ReactElement): void {
    this.reconciler.updateContainer(element, container, null, null);
  }

  clear(nodeId: UINodeId): void {
    this.treeManager.removeNode(nodeId);
  }
}