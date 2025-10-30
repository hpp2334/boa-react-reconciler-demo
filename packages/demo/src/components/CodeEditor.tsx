import React from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

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
  const getExtensions = () => {
    const extensions = [oneDark]

    // Add JavaScript/TypeScript support with JSX
    if (language === 'javascript' || language === 'jsx' || language === 'typescript' || language === 'tsx') {
      extensions.push(
        javascript({
          jsx: true,
          typescript: language === 'typescript' || language === 'tsx'
        })
      )
    }

    return extensions
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-200 text-sm font-medium text-gray-600">
        Code Editor
      </div>
      <div className="flex-1">
        <CodeMirror
          className='h-full'
          value={value}
          height={height}
          theme={oneDark}
          extensions={getExtensions()}
          onChange={(newValue) => onChange(newValue)}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            highlightSelectionMatches: false,
          }}
        />
      </div>
    </div>
  )
}

export default CodeEditor