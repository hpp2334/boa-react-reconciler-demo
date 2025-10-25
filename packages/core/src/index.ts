import { BoaContext } from '../../../boa-wasm/pkg'
import x from '@brrd/prelude?raw'


export function add(a: number, b: number): number {
  return parseFloat(new BoaContext().evaluate(`${a}+${b}`))
}
