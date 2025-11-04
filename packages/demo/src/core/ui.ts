import { UINodeDrawable } from "@brrd/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { JsRuntime } from "./js-runtime";

export function useDrawable(runtime: JsRuntime, code: string): UINodeDrawable | null {
    const rootIdRef = useRef<string>("")
    const [drawable, setDrawable] = useState<UINodeDrawable | null>(null)

    const updateDrawable = useCallback(() => {
        const rootId = rootIdRef.current

        const newDrawable = runtime.getDrawable(rootId)
        setDrawable(newDrawable)
    }, [])

    useEffect(() => {
        runtime.setAfterTimeout(() => {
            updateDrawable()
        })

        return () => {
            runtime.setAfterTimeout(null)
        }
    }, [updateDrawable])

    useEffect(() => {
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