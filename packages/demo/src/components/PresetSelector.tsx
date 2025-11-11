import React from 'react'
import { getAllPresets, getPresetConfig } from '../presets'

interface PresetSelectorProps {
  selectedPreset: string
  onPresetChange: (presetKey: string) => void
}

const PresetSelector: React.FC<PresetSelectorProps> = ({
  selectedPreset,
  onPresetChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="preset-select" className="font-medium text-gray-700">
        Examples:
      </label>
      <select
        id="preset-select"
        value={selectedPreset}
        onChange={(e) => onPresetChange((e.target as HTMLSelectElement).value)}
        className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm cursor-pointer min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {getAllPresets().map((preset) => {
          const conf = getPresetConfig(preset)

          return <option key={preset} value={preset}>
            {conf.name}
          </option>
        })}
      </select>
    </div>
  )
}

export default PresetSelector