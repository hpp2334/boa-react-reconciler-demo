import { transformSync } from "../../../boa-wasm/pkg/boa_wasm";

const settings = {
    jsc: {
        target: "es2016",
        parser: {
            syntax: 'typescript',
            tsx: true,
            dynamicImport: false,
            decorators: false,
        },
    },
};


export function compileTSX(code: string) {
    return transformSync(code, settings).code
}