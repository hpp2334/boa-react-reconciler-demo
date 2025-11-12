import { Config } from "./impl/type"

const cx = require.context("./impl", false)

const presets = ["counter", "todo_list", "remote_file_explorer"] as const

export type Preset = typeof presets[number]

export function getPresetConfig(p: Preset): Config {
    const v = cx(`./${p}`) as {
        default: Config
    }
    return v.default
}

export function getAllPresets(): ReadonlyArray<Preset> {
    return presets
}

export function isPreset(preset: string): preset is Preset {
    return (presets as ReadonlyArray<string>).includes(preset)
}