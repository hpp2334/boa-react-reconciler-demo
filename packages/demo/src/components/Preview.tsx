import React from 'react'
import type { UINodeDrawable } from '@brrd/types'
import DynComponent from './DynComponent'

interface PreviewProps {
  drawable: UINodeDrawable | null
}

const Preview: React.FC<PreviewProps> = ({ drawable }) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '10px 15px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #e1e5e9',
        fontSize: '14px',
        fontWeight: '500',
        color: '#495057'
      }}>
        Preview
      </div>
      <div
        style={{
          flex: 1,
          padding: '20px',
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}
      >
        {drawable ? (
          <DynComponent drawable={drawable} />
        ) : (
          <div style={{
            textAlign: 'center',
            color: '#6c757d',
            fontSize: '16px',
            marginTop: '40px'
          }}>
            <div style={{ marginBottom: '10px' }}>⚠️</div>
            <div>Code compilation failed or has errors</div>
            <div style={{ fontSize: '14px', marginTop: '10px' }}>
              Check the console for more details
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Preview