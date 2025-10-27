import { BoaContext } from "../../../boa-wasm/pkg/boa_wasm";
import vmCode from '@brrd/vm?raw'
import type { UINodeDrawable, UINodeId } from "@brrd/types";
import { compileTSX } from "./compile";
import { toBase64 } from "js-base64";

export class JsRuntime {
    private _cx = new BoaContext()

    constructor() {
        this.initializeContext()
    }

    private initializeContext() {
        this.evaluate("Date.now = () => { return 0 }")
        this.evaluate("globalThis.setTimeout = () => {}")
        this.evaluate("globalThis.cancelTimeout = () => {}")
        this.evaluate(vmCode)
    }

    createRoot(): UINodeId {
        return this.evaluate("BrrdVM.createRoot()")
    }

    render(id: UINodeId, code: string) {
        const compiled = compileTSX(code)
        const v = `BrrdVM.render("${id}", BrrdVM.fromBase64("${toBase64(compiled)}"))`
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
