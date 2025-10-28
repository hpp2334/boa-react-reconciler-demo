import React, { useState, useEffect, useRef } from 'react'
import { JsRuntime } from './core/js-runtime'
import type { UINodeDrawable } from '@brrd/types'
import CodeEditor from './components/CodeEditor'
import Preview from './components/Preview'
import PresetSelector from './components/PresetSelector'
import "./presets"
import { getPresetConfig, isPreset, Preset } from './presets'

const App: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<Preset>('counter')
  const [code, setCode] = useState<string>(getPresetConfig(selectedPreset).code)
  const [runtime] = useState(() => new JsRuntime())
  const rootIdRef = useRef<string>("")
  const [drawable, setDrawable] = useState<UINodeDrawable | null>(null)


  useEffect(() => {
    const rootId = runtime.createRoot()
    rootIdRef.current = rootId

    try {
      runtime.render(rootId, code)
      const newDrawable = runtime.getDrawable(rootId)
      setDrawable(newDrawable)
    } catch (error) {
      console.error('Error rendering code:', error)
      setDrawable(null)
    }

    return () => {
      runtime.removeRoot(rootId)
    }
  }, [code, runtime])

  const handlePresetChange = (presetKey: string) => {
    if (isPreset(presetKey)) {
      setSelectedPreset(presetKey)
      setCode(getPresetConfig(presetKey).code)
    }
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