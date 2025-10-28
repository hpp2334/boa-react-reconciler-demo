import React from 'react'
import type { UINodeDrawable } from '@brrd/types'

interface DynComponentProps {
  drawable: UINodeDrawable
}

const DynComponent: React.FC<DynComponentProps> = ({ drawable }) => {
  const renderNode = (node: UINodeDrawable): React.ReactNode => {
    const { type, props, children } = node

    // Base styles for all nodes
    const baseStyle: React.CSSProperties = {}

    // Apply color and background color if present
    if (props.color) baseStyle.color = props.color
    if (props.backgroundColor) baseStyle.backgroundColor = props.backgroundColor

    // Container styles for row/column layout
    const containerStyle: React.CSSProperties = {
      ...baseStyle,
      display: 'flex',
      flexDirection: type === 'row' ? 'row' : 'column',
      gap: props.gap !== undefined ? `${props.gap}px` : undefined,
    }

    // Handle different node types
    switch (type) {
      case 'text':
        return (
          <span key={node.id} style={baseStyle}>
            {props.text || ''}
            {children.map(renderNode)}
          </span>
        )

      case 'row':
        return (
          <div key={node.id} style={containerStyle}>
            {children.map(renderNode)}
          </div>
        )

      case 'column':
        return (
          <div key={node.id} style={containerStyle}>
            {children.map(renderNode)}
          </div>
        )

      default:
        // Fallback for any unexpected types
        return (
          <div key={node.id} style={baseStyle}>
            {children.map(renderNode)}
          </div>
        )
    }
  }

  return <>{renderNode(drawable)}</>
}

export default DynComponent