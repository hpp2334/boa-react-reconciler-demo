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
    <div className="h-full flex flex-col">
      <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-200 text-sm font-medium text-gray-600">
        Code Editor
      </div>
      <div className="flex-1">
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