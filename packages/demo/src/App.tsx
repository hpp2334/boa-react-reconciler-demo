import React, { useState, useEffect } from 'react'
import { JsRuntime } from './core/js-runtime'
import type { UINodeDrawable } from '@brrd/types'
import CodeEditor from './components/CodeEditor'
import Preview from './components/Preview'
import PresetSelector from './components/PresetSelector'
import { PRESET_EXAMPLES } from './presets'

const App: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('counter')
  const [code, setCode] = useState<string>(PRESET_EXAMPLES[selectedPreset]?.code || '')
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
    setCode(PRESET_EXAMPLES[presetKey]?.code || '')
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
  }

  return (
    <div className="flex flex-col h-screen w-screen">
      <header className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-700 m-0">BOA React Reconciler Demo</h1>
        <PresetSelector
          selectedPreset={selectedPreset}
          onPresetChange={handlePresetChange}
        />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 border-r border-gray-200 flex flex-col bg-white">
          <CodeEditor
            value={code}
            onChange={handleCodeChange}
            language='typescript'
          />
        </div>
        <div className="flex-1 bg-gray-50 flex flex-col">
          <Preview drawable={drawable} />
        </div>
      </div>
    </div>
  )
}

export default App