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
    <div className="preset-selector">
      <label htmlFor="preset-select" style={{ marginRight: '10px', fontWeight: '500' }}>
        Examples:
      </label>
      <select
        id="preset-select"
        value={selectedPreset}
        onChange={(e) => onPresetChange(e.target.value)}
        style={{
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          backgroundColor: '#ffffff',
          fontSize: '14px',
          cursor: 'pointer',
          minWidth: '200px'
        }}
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