import { BoaContext } from '../../../boa-wasm/pkg'
import vmCode from '@brrd/vm?raw'

export function add(a: number, b: number): number {
  return parseFloat(new BoaContext().evaluate(`${a}+${b}`))
}

export function testCx() {
  const cx = new BoaContext()
  // TODO
  cx.evaluate("Date.now = () => { return 0 }")
  cx.evaluate("globalThis.setTimeout = () => {}")
  cx.evaluate("globalThis.cancelTimeout = () => {}")

  cx.evaluate(vmCode)
  const s = cx.evaluate(`
const id = BrrdVM.createRoot();
BrrdVM.render(id, 'return React.createElement("text", { text: "hello" })')
BrrdVM.getDrawable(id)
    `)
  return s
}