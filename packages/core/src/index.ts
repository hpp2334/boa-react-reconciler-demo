import { main_js, evaluate } from '@boa-dev/boa_wasm'
import x from '@brrd/prelude?raw'


export function add(a: number, b: number): number {
  return parseFloat(evaluate(`${a}+${b}`))
}
