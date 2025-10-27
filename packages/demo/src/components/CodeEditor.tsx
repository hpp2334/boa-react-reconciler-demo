import React from 'react'
import Editor from '@monaco-editor/react'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  height?: string
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  height = '100%',
}) => {
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
        Code Editor
      </div>
      <div style={{ flex: 1 }}>
        <Editor
          height={height}
          language={language}
          value={value}
          onChange={(newValue) => onChange(newValue || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            padding: { top: 10, bottom: 10 }
          }}
        />
      </div>
    </div>
  )
}

export default CodeEditor