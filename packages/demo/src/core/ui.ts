import { UINodeDrawable } from "@brrd/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { JsRuntime } from "./js-runtime";

export function useDrawable(code: string): UINodeDrawable | null {
    const rootIdRef = useRef<string>("")
    const rtRef = useRef(new JsRuntime())
    const [drawable, setDrawable] = useState<UINodeDrawable | null>(null)

    const updateDrawable = useCallback(() => {
        const runtime = rtRef.current
        const rootId = rootIdRef.current

        const newDrawable = runtime.getDrawable(rootId)
        setDrawable(newDrawable)
    }, [])

    useEffect(() => {
        const runtime = rtRef.current
        runtime.setAfterTimeout(() => {
            updateDrawable()
        })

        return () => {
            runtime.setAfterTimeout(null)
        }
    }, [updateDrawable])

    useEffect(() => {
        const runtime = rtRef.current

        const rootId = runtime.createRoot()
        rootIdRef.current = rootId


        try {
            runtime.render(rootId, code)
            updateDrawable()
        } catch (error) {
            console.error('Error rendering code:', error)
            setDrawable(null)
        }

        return () => {
            runtime.removeRoot(rootId)
            rootIdRef.current = ""
        }
    }, [code])

    return drawable
}