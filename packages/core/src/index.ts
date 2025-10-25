import { BoaContext } from '../../../boa-wasm/pkg'
import preludeCode from '@brrd/prelude?raw'
import vmCode from '@brrd/vm?raw'

export function add(a: number, b: number): number {
  return parseFloat(new BoaContext().evaluate(`${a}+${b}`))
}

export function testCx() {
  const cx = new BoaContext()
  cx.evaluate("Date.now = () => { return 0 }")
  cx.evaluate(preludeCode)
  cx.evaluate("BrrdPrelude.setup()")
  cx.evaluate(vmCode)
  const s = cx.evaluate(`
const id = BrrdVM.createRoot();
id;
    `)
  return s
}