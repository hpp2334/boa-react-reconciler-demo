import { BoaContext } from '../../../boa-wasm/pkg'
import x from '@brrd/prelude?raw'


export function add(a: number, b: number): number {
  return parseFloat(new BoaContext().evaluate(`${a}+${b}`))
}

export function testCx() {
  const cx = new BoaContext()
  cx.evaluate("var x = { y: 1 }")
  cx.evaluate("x.y = 2")
  return cx.evaluate("x.z.a = 3")
}