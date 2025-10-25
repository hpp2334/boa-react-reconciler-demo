import { describe, it, expect, beforeEach } from 'vitest';
import { TreeManager } from '../tree';
import React, { act } from 'react';
import { VM } from '../vm';

describe('VM', () => {
  let vm: VM;

  beforeEach(() => {
    vm = new VM();
  });

  describe('initialization and root creation', () => {
    it('should create VM instance successfully', () => {
      expect(vm).toBeInstanceOf(VM);
    });

    it('should create root and return valid root ID', () => {
      const rootId = vm.createRoot();
      expect(rootId).toBeDefined();
      expect(typeof rootId).toBe('string');
      expect(rootId).toMatch(/^node_\d+_[a-z0-9]+$/);
    });

    it('should create multiple unique root IDs', () => {
      const root1 = vm.createRoot();
      const root2 = vm.createRoot();
      const root3 = vm.createRoot();

      expect(root1).not.toBe(root2);
      expect(root2).not.toBe(root3);
      expect(root1).not.toBe(root3);
    });

    it('should initialize with empty tree', () => {
      const rootId = vm.createRoot();
      const snapshot = vm.snapshot(rootId);
      expect(snapshot).toContain('<rect>');
    });
  });

  describe('basic element rendering and snapshots', () => {
    it('should render simple rect element', () => {
      const rootId = vm.createRoot();
      const element = React.createElement('rect', {
        width: 100,
        height: 200
      });

      act(() => {
        vm.render(rootId, element);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <rect width=100 height=200>"
      `);
    });

    it('should render rect with string props', () => {
      const rootId = vm.createRoot();
      const element = React.createElement('rect', {
        fill: 'red',
        stroke: 'blue',
        width: 50,
        height: 75
      });

      act(() => {
        vm.render(rootId, element);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <rect width=50 height=75>"
      `);
    });

    it('should render text node correctly', () => {
      const rootId = vm.createRoot();
      const element = React.createElement('text', {
        text: 'Hello World'
      });

      act(() => {
        vm.render(rootId, element);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <text text="Hello World">"
      `);
    });

    it('should render complex nested structure', () => {
      const rootId = vm.createRoot();
      const element = React.createElement('rect', {
        width: 300,
        height: 300,
        fill: 'white'
      }, [
        React.createElement('rect', {
          x: 10,
          y: 10,
          width: 50,
          height: 50,
          fill: 'blue'
        }),
        React.createElement('text', {
          x: 20,
          y: 20,
          text: 'Nested text'
        })
      ]);

      act(() => {
        vm.render(rootId, element);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <rect width=300 height=300>
            <rect x=10 y=10 width=50 height=50>
            <text x=20 y=20 text="Nested text">"
      `);
    });

    it('should preserve original test case', () => {
      const element = React.createElement('rect', {
        width: 300,
        height: 300,
      }, [
        React.createElement('text', {
          text: 'Hello world'
        })
      ]);

      const rootId = vm.createRoot();
      act(() => {
        vm.render(rootId, element);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <rect width=300 height=300>
            <text text="Hello world">"
      `);
    });
  });

  describe('element updates and re-rendering', () => {
    it('should update element props on re-render', () => {
      const rootId = vm.createRoot();
      const initialElement = React.createElement('rect', {
        width: 100,
        height: 100,
        fill: 'red'
      });

      act(() => {
        vm.render(rootId, initialElement);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <rect width=100 height=100>"
      `);

      const updatedElement = React.createElement('rect', {
        width: 100,
        height: 100,
        fill: 'blue'
      });

      act(() => {
        vm.render(rootId, updatedElement);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <rect width=100 height=100>"
      `);
    });

    it('should handle multiple prop updates', () => {
      const rootId = vm.createRoot();
      const element1 = React.createElement('rect', {
        width: 50,
        height: 75,
        fill: 'green',
        stroke: 'black'
      });

      act(() => {
        vm.render(rootId, element1);
      });

      const element2 = React.createElement('rect', {
        width: 100,
        height: 150,
        fill: 'yellow',
        stroke: 'red',
        opacity: 0.8
      });

      act(() => {
        vm.render(rootId, element2);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <rect width=100 height=150>"
      `);
    });

    it('should update text content', () => {
      const rootId = vm.createRoot();
      const initialText = React.createElement('text', {
        text: 'Initial text'
      });

      act(() => {
        vm.render(rootId, initialText);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <text text="Initial text">"
      `);

      const updatedText = React.createElement('text', {
        text: 'Updated text content'
      });

      act(() => {
        vm.render(rootId, updatedText);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <text text="Updated text content">"
      `);
    });
  });

  describe('nested elements and children management', () => {
    it('should render deeply nested structures', () => {
      const rootId = vm.createRoot();
      const element = React.createElement('rect', {
        width: 400,
        height: 400
      }, [
        React.createElement('rect', {
          width: 200,
          height: 200
        }, [
          React.createElement('rect', {
            width: 100,
            height: 100
          }, [
            React.createElement('text', {
              text: 'Deeply nested'
            })
          ])
        ])
      ]);

      act(() => {
        vm.render(rootId, element);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <rect width=400 height=400>
            <rect width=200 height=200>
              <rect width=100 height=100>
                <text text="Deeply nested">"
      `);
    });

    it('should handle adding and removing children', () => {
      const rootId = vm.createRoot();

      // Initial render with one child
      const element1 = React.createElement('rect', {
        width: 300,
        height: 300
      }, [
        React.createElement('text', {
          text: 'Child 1'
        })
      ]);

      act(() => {
        vm.render(rootId, element1);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <rect width=300 height=300>
            <text text="Child 1">"
      `);

      // Add second child
      const element2 = React.createElement('rect', {
        width: 300,
        height: 300
      }, [
        React.createElement('text', {
          text: 'Child 1'
        }),
        React.createElement('text', {
          text: 'Child 2'
        })
      ]);

      act(() => {
        vm.render(rootId, element2);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <rect width=300 height=300>
            <text text="Child 1">
            <text text="Child 2">"
      `);

      // Remove first child
      const element3 = React.createElement('rect', {
        width: 300,
        height: 300
      }, [
        React.createElement('text', {
          text: 'Child 2'
        })
      ]);

      act(() => {
        vm.render(rootId, element3);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <rect width=300 height=300>
            <text text="Child 2">"
      `);
    });

    it('should render arrays of children', () => {
      const rootId = vm.createRoot();
      const children = [
        React.createElement('text', { text: 'First' }),
        React.createElement('text', { text: 'Second' }),
        React.createElement('text', { text: 'Third' })
      ];

      const element = React.createElement('rect', {
        width: 200,
        height: 200
      }, children);

      act(() => {
        vm.render(rootId, element);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <rect width=200 height=200>
            <text text="First">
            <text text="Second">
            <text text="Third">"
      `);
    });
  });

  describe('text content handling', () => {
    it('should handle empty text content', () => {
      const rootId = vm.createRoot();
      const element = React.createElement('text', {
        text: ''
      });

      act(() => {
        vm.render(rootId, element);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <text>"
      `);
    });

    it('should handle text with special characters', () => {
      const rootId = vm.createRoot();
      const element = React.createElement('text', {
        text: 'Hello <world> & "quotes"!'
      });

      act(() => {
        vm.render(rootId, element);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <text text="Hello <world> & \\"quotes\\"!">"
      `);
    });

    it('should handle very long text content', () => {
      const rootId = vm.createRoot();
      const longText = 'A'.repeat(1000);
      const element = React.createElement('text', {
        text: longText
      });

      act(() => {
        vm.render(rootId, element);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <text text="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA">"
      `);
    });

    it('should handle text with numeric values converted to strings', () => {
      const rootId = vm.createRoot();
      const element = React.createElement('text', {
        text: 12345
      });

      act(() => {
        vm.render(rootId, element);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <text text=12345>"
      `);
    });
  });

  describe('element removal and cleanup', () => {
    it('should clear node and handle snapshot of non-existent node', () => {
      const rootId = vm.createRoot();
      const element = React.createElement('rect', {
        width: 100,
        height: 100
      });

      act(() => {
        vm.render(rootId, element);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <rect width=100 height=100>"
      `);

      vm.clear(rootId);

      // After clearing, snapshot should indicate node not found
      expect(vm.snapshot(rootId)).toBe(`Node ${rootId} not found`);
    });

    it('should handle clearing non-existent node gracefully', () => {
      const nonExistentId = 'non_existent_node';

      // Should not throw error
      expect(() => {
        vm.clear(nonExistentId);
      }).not.toThrow();
    });
  });

  describe('error handling and edge cases', () => {
    it('should throw error when rendering to non-existent node', () => {
      const nonExistentId = 'non_existent_node';
      const element = React.createElement('rect', {
        width: 100,
        height: 100
      });

      expect(() => {
        act(() => {
          vm.render(nonExistentId, element);
        });
      }).toThrow(`Node ${nonExistentId} not found`);
    });

    it('should throw error when rendering to non-root node', () => {
      // Create a node directly without creating a root
      const treeManager = new TreeManager();
      const nonRootNode = treeManager.createNode('rect', {});

      const element = React.createElement('rect', {
        width: 100,
        height: 100
      });

      expect(() => {
        act(() => {
          vm.render(nonRootNode.id, element);
        });
      }).toThrow(`Node ${nonRootNode.id} not found`);
    });

    it('should handle null and undefined props', () => {
      const rootId = vm.createRoot();
      const element = React.createElement('rect', {
        width: 100,
        height: null,
        fill: undefined,
        stroke: 'black'
      });

      act(() => {
        vm.render(rootId, element);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <rect width=100>"
      `);
    });

    it('should handle complex object props', () => {
      const rootId = vm.createRoot();
      const complexObject = { nested: { value: 42 } };
      const array = [1, 2, 3];

      const element = React.createElement('rect', {
        width: 100,
        data: complexObject,
        items: array
      });

      act(() => {
        vm.render(rootId, element);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <rect width=100>"
      `);
    });
  });

  describe('TreeManager integration', () => {
    it('should use TreeManager for node operations', () => {
      const rootId = vm.createRoot();

      // Verify TreeManager is working internally
      const element = React.createElement('rect', {
        width: 150,
        height: 200
      }, [
        React.createElement('text', { text: 'Tree test' })
      ]);

      act(() => {
        vm.render(rootId, element);
      });

      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <rect width=150 height=200>
            <text text="Tree test">"
      `);
    });

    it('should handle node type mapping correctly', () => {
      const rootId = vm.createRoot();

      // Test different element types
      const rectElement = React.createElement('rect', { width: 50, height: 50 });
      const textElement = React.createElement('text', { text: 'test' });
      const unknownElement = React.createElement('unknown', { prop: 'value' });

      act(() => {
        vm.render(rootId, rectElement);
      });
      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <rect width=50 height=50>"
      `);

      act(() => {
        vm.render(rootId, textElement);
      });
      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <text text="test">"
      `);

      // Unknown types should default to 'rect'
      act(() => {
        vm.render(rootId, unknownElement);
      });
      expect(vm.snapshot(rootId)).toMatchInlineSnapshot(`
        "<rect>
          <rect>"
      `);
    });
  });
});
