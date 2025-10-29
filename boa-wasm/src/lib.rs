use swc_core::binding_macros::build_transform_sync;
use wasm_bindgen::prelude::*;
use boa_engine::{Context, JsString, NativeFunction, Source, js_string};

#[wasm_bindgen(start)]
fn _start() {
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
extern "C" {
    fn bc_set_timeout(value: BindgenBoaJsFunc, ms: u32) -> u32;
    fn bc_clear_timeout(handle: u32);
    fn bc_date_now() -> u32;
}

#[wasm_bindgen]
pub struct BindgenBoaJsFunc {
    value: boa_engine::object::builtins::JsFunction
}

#[wasm_bindgen]
pub struct BoaContext {
    context: Context
}

fn nf_set_timeout(_this: &boa_engine::JsValue, args: &[boa_engine::JsValue], cx: &mut Context) -> boa_engine::JsResult<boa_engine::JsValue> {
    let f = args[0].as_function().expect("failed to cast to function");
    let ms = if args.len() >= 2 {
        args[1].as_i32()
    } else {
        None
    };
    let ms = ms.unwrap_or(4);

    let handle = bc_set_timeout(BindgenBoaJsFunc {
        value: f
    }, ms as u32);
    Ok(boa_engine::JsValue::from(handle))
}

fn nf_clear_timeout(_this: &boa_engine::JsValue, args: &[boa_engine::JsValue], cx: &mut Context) -> boa_engine::JsResult<boa_engine::JsValue> {
    if args.len() == 1 {
        let arg = args.first().unwrap();
        let arg = arg.as_i32();
        if let Some(handle) = arg {
            bc_clear_timeout(handle as u32);
        }
    }
    Ok(boa_engine::JsValue::null())
}

fn nf_date_now(_this: &boa_engine::JsValue, _args: &[boa_engine::JsValue], cx: &mut Context) -> boa_engine::JsResult<boa_engine::JsValue> {
    let v = bc_date_now();
    Ok(boa_engine::JsValue::from(v as f64))
}


fn build_context() -> Context {
    let mut cx = Context::default();
    cx.register_global_builtin_callable(js_string!("setTimeout"), 2, NativeFunction::from_fn_ptr(nf_set_timeout)).expect("failed to create setTimeout fuc");
    cx.register_global_builtin_callable(js_string!("clearTimeout"), 1, NativeFunction::from_fn_ptr(nf_clear_timeout)).expect("failed to create clearTimeout fuc");
    cx.register_global_builtin_callable(js_string!("_DateNow"), 0, NativeFunction::from_fn_ptr(nf_date_now)).expect("failed to create _DateNow func");
    cx
}

#[wasm_bindgen]
impl BoaContext {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self { context: build_context() }
    }

    #[wasm_bindgen]
    pub fn evaluate(&mut self, s: &str) -> Result<String, JsValue> {
        let r = self.context.eval(Source::from_bytes(s));
        match r {
            Ok(r) => Ok(r.to_string(&mut self.context).expect("failed to string").to_std_string().expect("failed to std string")),
            Err(e) => Err(JsValue::from(format!("Uncaught {e}")))
        }
    }

    #[wasm_bindgen]
    pub fn invoke_on_timeout(&mut self, f: BindgenBoaJsFunc)  -> Result<String, JsValue> {
        let f = f.value;
        let r = f.call(&boa_engine::JsValue::null(), &[], &mut self.context);
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