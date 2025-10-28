import React from 'react'
import { PRESET_EXAMPLES } from '../presets'

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
        {Object.entries(PRESET_EXAMPLES).map(([key, preset]) => (
          <option key={key} value={key}>
            {preset.name} - {preset.description}
          </option>
        ))}
      </select>
    </div>
  )
}

export default PresetSelector