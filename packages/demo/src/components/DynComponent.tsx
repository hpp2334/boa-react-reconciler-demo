import React from 'react'
import type { UINodeDrawable } from '@brrd/types'
import { JsRuntime } from '../core'

interface DynComponentProps {
  drawable: UINodeDrawable
  rt: JsRuntime
}

const DynComponent: React.FC<DynComponentProps> = ({ rt, drawable }) => {
  const renderNode = (node: UINodeDrawable): React.ReactNode => {
    const { type, props, children, parentType } = node

    // Base styles for all nodes
    const baseStyle: React.CSSProperties = {
      position: 'relative'
    }

    if (props.backgroundColor) baseStyle.backgroundColor = props.backgroundColor

    // Apply dimension properties
    if (props.width !== undefined) baseStyle.width = props.width
    if (props.height !== undefined) baseStyle.height = props.height

    if (type === 'text') {
      // Apply typography properties
      if (props.color) baseStyle.color = props.color
      if (props.fontSize !== undefined) baseStyle.fontSize = `${props.fontSize}px`
      if (props.fontWeight !== undefined) baseStyle.fontWeight = props.fontWeight
    }


    // Handle absolute positioning when parent is a box
    if (parentType === 'box') {
      baseStyle.position = 'absolute'
    }
    if (type === 'padding') {
      if (props.top !== undefined) baseStyle.paddingTop = `${props.top}px`
      if (props.bottom !== undefined) baseStyle.paddingBottom = `${props.bottom}px`
      if (props.left !== undefined) baseStyle.paddingLeft = `${props.left}px`
      if (props.right !== undefined) baseStyle.paddingRight = `${props.right}px`
    }

    // Apply offset properties (work like CSS margins)
    if (props.offsetTop !== undefined) baseStyle.top = `${props.offsetTop}px`
    if (props.offsetBottom !== undefined) baseStyle.bottom = `${props.offsetBottom}px`
    if (props.offsetLeft !== undefined) baseStyle.left = `${props.offsetLeft}px`
    if (props.offsetRight !== undefined) baseStyle.right = `${props.offsetRight}px`

    if (props.borderColor) {
      baseStyle.borderColor = props.borderColor
      baseStyle.borderWidth = "1px"
    }
    if (props.borderRadius) baseStyle.borderRadius = `${props.borderRadius}px`

    if (type === 'row' || type === 'column') {
      baseStyle.display = 'flex'
      baseStyle.flexDirection = type === 'row' ? 'row' : 'column'
      baseStyle.gap = props.gap !== undefined ? `${props.gap}px` : undefined

      // Apply flexbox alignment properties
      if (props.mainAlignment) {
        const alignmentMap = {
          start: 'flex-start',
          center: 'center',
          end: 'flex-end'
        }
        const mainAxis = type === 'row' ? 'justifyContent' : 'alignItems'
        baseStyle[mainAxis] = alignmentMap[props.mainAlignment]
      }

      if (props.crossAlignment) {
        const alignmentMap = {
          start: 'flex-start',
          center: 'center',
          end: 'flex-end'
        }
        const crossAxis = type === 'row' ? 'alignItems' : 'justifyContent'
        baseStyle[crossAxis] = alignmentMap[props.crossAlignment]
      }
    }

    let value = props.value

    let onClick = () => {}
    if (props.hasClickHandler) {
      onClick = () => {
        rt.emitClickEvent(node.id)
      }
    }

    let onChange: React.ChangeEventHandler<HTMLInputElement> = (_value) => {}
    if (props.hasInputHandler) {
      onChange = (value) => {
        rt.emitInputEvent(node.id, value.target.value)
      }
    }

    // Handle different node types
    switch (type) {
      case 'input':
        return (
          <input data-type={type} key={node.id} style={baseStyle} value={value} onClick={onClick} onChange={onChange}></input>
        )
      case 'text':
        return (
          <span data-type={type} key={node.id} style={baseStyle}>
            {props.text || ''}
          </span>
        )
      default:
        // Fallback for any unexpected types
        return (
          <div data-type={type} key={node.id} style={baseStyle} onClick={onClick}>
            {children.map(renderNode)}
          </div>
        )
    }
  }

  return <>{renderNode(drawable)}</>
}

export default DynComponent