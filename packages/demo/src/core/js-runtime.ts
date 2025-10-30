import { BoaContext } from "../../../../boa-wasm/pkg/boa_wasm";
import vmCode from '@brrd/vm?raw'
import type { UINodeDrawable, UINodeId } from "@brrd/types";
import { compileTSX } from "./compile";
import { toBase64 } from "js-base64";

const onTimeoutHandlers: Set<(cx_id: number, f: any) => void> = new Set();

const finalizationRegistry = new FinalizationRegistry((heldValue: () => void) => {
    heldValue();
});

(() => {
    const g = globalThis as any

    g.bc_date_now = () => {
        return Date.now()
    }
    g.bc_set_timeout = (cx_id: number, f: any, ms: number) => {
        console.log("bc_set_timeout", cx_id, f)
        setTimeout(() => {
            for (const cb of onTimeoutHandlers) {
                cb(cx_id, f)
            }
        }, ms)
    }
    g.bc_clear_timeout = (id: any) => {
        clearTimeout(id)
    }
})()

export class JsRuntime {
    private _cx = new BoaContext()
    private _afterTimeout: (() => void) | null = null

    constructor() {
        this.initializeContext()

        const onTimeout = this.onTimeout
        onTimeoutHandlers.add(onTimeout)
        finalizationRegistry.register(this, () => {
            onTimeoutHandlers.delete(onTimeout)
        })
    }

    setAfterTimeout(f: (() => void) | null) {
        this._afterTimeout = f
    }

    private onTimeout = (cx_id: number, f: any) => {
        if (cx_id === this._cx.id()) {
            this._cx.invoke_on_timeout(f)
            this._afterTimeout?.()
        }
    }

  
    private initializeContext() {
        this.evaluate("Date.now = () => { return _DateNow() }")
        this.evaluate(vmCode)
    }

    createRoot(): UINodeId {
        const id = this.evaluate("BrrdVM.createRoot()")
        return id
    }

    removeRoot(id: UINodeId) {
        this.evaluate(`BrrdVM.removeRoot("${id}")`)
    }

    render(id: UINodeId, code: string) {
        const compiled = compileTSX(`
(function () {
${code}

return <App />
})()
`)
        const v = `BrrdVM.render("${id}", "return " + BrrdVM.fromBase64("${toBase64(compiled)}"))`
        this.evaluate(v)
    }

    getDrawable(id: UINodeId): UINodeDrawable {
        const ret = this.evaluate(`BrrdVM.getDrawable("${id}")`)
        return JSON.parse(ret)
    }

    private evaluate(code: string) {
        return this._cx.evaluate(code)
    }
}
