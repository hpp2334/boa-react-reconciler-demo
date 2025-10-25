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
        self.context.eval(Source::from_bytes(s))
        .map_err(|e| JsValue::from(format!("Uncaught {e}")))
        .map(|v| v.display().to_string())
    }
}
