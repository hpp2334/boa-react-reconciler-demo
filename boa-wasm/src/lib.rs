use swc_core::binding_macros::build_transform_sync;
use wasm_bindgen::prelude::*;
use boa_engine::{Context, Source};

#[wasm_bindgen(start)]
fn _start() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub struct BoaContext {
    context: Context
}

#[wasm_bindgen]
impl BoaContext {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self { context: Context::default() }
    }

    #[wasm_bindgen]
    pub fn evaluate(&mut self, s: &str) -> Result<String, JsValue> {
        let r = self.context.eval(Source::from_bytes(s));
        match r {
            Ok(r) => Ok(r.to_string(&mut self.context).expect("failed to string").to_std_string().expect("failed to std string")),
            Err(e) => Err(JsValue::from(format!("Uncaught {e}")))
        }
    }
}

#[wasm_bindgen(typescript_custom_section)]
const INTERFACE_DEFINITIONS: &'static str = r#"
export function transformSync(code: string, opts?: unknown, experimental_plugin_bytes_resolver?: any): { code: string; map?: string; };
"#;
build_transform_sync!(#[wasm_bindgen(js_name = "transformSync", typescript_type = "transformSync",skip_typescript)]);