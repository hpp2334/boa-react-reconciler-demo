import React, { useState, useEffect } from 'react'
import CodeEditor from './components/CodeEditor'
import Preview from './components/Preview'
import PresetSelector from './components/PresetSelector'
import "./presets"
import { getPresetConfig, isPreset, Preset } from './presets'
import { useDrawable } from './core/ui'
import { JsRuntime } from './core'

const rt = new JsRuntime()

const App: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<Preset>('counter')
  const [code, setCode] = useState<string>(getPresetConfig(selectedPreset).code)
  const drawable = useDrawable(rt, code)

  // Function to get preset from URL path
  const getPresetFromPath = (): Preset => {
    const path = window.location.pathname.substring(1) // Remove leading slash
    if (path && isPreset(path)) {
      return path
    }
    return 'counter' // Default preset
  }

  // Update URL when preset changes
  const updateURL = (preset: Preset) => {
    const newURL = `${window.location.origin}/${preset}`
    window.history.pushState({}, '', newURL)
  }

  // Initialize preset from URL on mount
  useEffect(() => {
    const presetFromURL = getPresetFromPath()
    setSelectedPreset(presetFromURL)
    setCode(getPresetConfig(presetFromURL).code)
  }, [])

  // Listen to browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const presetFromURL = getPresetFromPath()
      setSelectedPreset(presetFromURL)
      setCode(getPresetConfig(presetFromURL).code)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handlePresetChange = (presetKey: string) => {
    if (isPreset(presetKey)) {
      setSelectedPreset(presetKey)
      setCode(getPresetConfig(presetKey).code)
      updateURL(presetKey)
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
            language='jsx'
          />
        </div>
        <div className="flex-1 bg-gray-50 flex flex-col">
          <Preview rt={rt} drawable={drawable} />
        </div>
      </div>
    </div>
  )
}

export default App