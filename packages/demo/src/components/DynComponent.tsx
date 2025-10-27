import React from 'react'
import type { UINodeDrawable } from '@brrd/types'

interface DynComponentProps {
  drawable: UINodeDrawable
}

const DynComponent: React.FC<DynComponentProps> = ({ drawable }) => {
  const renderNode = (node: UINodeDrawable): React.ReactNode => {
    const { type, props, children } = node

    // Convert UINodeDrawable props to React props
    const reactProps: React.HTMLAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLSpanElement> = {}

    if (props.width !== undefined) reactProps.style = { ...reactProps.style, width: props.width }
    if (props.height !== undefined) reactProps.style = { ...reactProps.style, height: props.height }
    if (props.x !== undefined) reactProps.style = { ...reactProps.style, position: 'absolute', left: props.x }
    if (props.y !== undefined) reactProps.style = { ...reactProps.style, position: 'absolute', top: props.y }
    if (props.text !== undefined) reactProps.children = props.text
    if (props.color !== undefined) reactProps.style = { ...reactProps.style, color: props.color }
    if (props.backgroundColor !== undefined) reactProps.style = { ...reactProps.style, backgroundColor: props.backgroundColor }

    // Handle different node types
    if (type === 'text') {
      return (
        <span key={node.id} {...reactProps}>
          {props.text || ''}
          {children.map(renderNode)}
        </span>
      )
    } else {
      // Default to div for 'rect' and other types
      return (
        <div key={node.id} {...reactProps}>
          {children.map(renderNode)}
        </div>
      )
    }
  }

  return <>{renderNode(drawable)}</>
}

export default DynComponent