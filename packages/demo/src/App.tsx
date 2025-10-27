import React, { useState, useEffect } from 'react'
import { JsRuntime } from './core/js-runtime'
import type { UINodeDrawable } from '@brrd/types'
import CodeEditor from './components/CodeEditor'
import Preview from './components/Preview'
import PresetSelector from './components/PresetSelector'
import { PRESET_EXAMPLES } from './presets'
import './App.css'

const App: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('counter')
  const [code, setCode] = useState<string>(PRESET_EXAMPLES[selectedPreset].code)
  const [runtime] = useState(() => new JsRuntime())
  const [rootId] = useState(() => runtime.createRoot())
  const [drawable, setDrawable] = useState<UINodeDrawable | null>(null)

  useEffect(() => {
    return () => {
      if (rootId) {
        runtime.removeRoot(rootId)
      }
    }
  }, [runtime, rootId])

  useEffect(() => {
    try {
      runtime.render(rootId, code)
      const newDrawable = runtime.getDrawable(rootId)
      setDrawable(newDrawable)
    } catch (error) {
      console.error('Error rendering code:', error)
      setDrawable(null)
    }
  }, [code, runtime, rootId])

  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey)
    setCode(PRESET_EXAMPLES[presetKey].code)
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>BOA React Reconciler Demo</h1>
        <PresetSelector
          selectedPreset={selectedPreset}
          onPresetChange={handlePresetChange}
        />
      </header>
      <div className="app-content">
        <div className="editor-panel">
          <CodeEditor
            value={code}
            onChange={handleCodeChange}
            language="typescript"
          />
        </div>
        <div className="preview-panel">
          <Preview drawable={drawable} />
        </div>
      </div>
    </div>
  )
}

export default App