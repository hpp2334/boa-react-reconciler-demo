use std::collections::HashSet;
use std::sync::Mutex;
use std::sync::atomic::AtomicI32;
use std::thread;
use std::time::Duration;

use boa_engine::job::{NativeJob, TimeoutJob};
use boa_engine::{JsError, JsResult, JsValue};

use boa_engine::{Context, NativeFunction, Source, js_string};
use serde::Deserialize;

thread_local! {
    static CX_ID: AtomicI32 = AtomicI32::new(1);
    static CLEARED_TIMERS: Mutex<HashSet<i32>> = Default::default();
    static TIMER_ID: AtomicI32 = AtomicI32::new(1);
}

#[derive(Deserialize, Debug, Clone)]
pub struct UINodeProps {
    // text
    pub text: Option<String>,
    #[serde(rename = "fontSize")]
    pub font_size: Option<f32>,
    #[serde(rename = "fontWeight")]
    pub font_weight: Option<f32>,
    // column, row
    pub gap: Option<f32>,
    #[serde(rename = "mainAlignment")]
    pub main_alignment: Option<Alignment>,
    #[serde(rename = "crossAlignment")]
    pub cross_alignment: Option<Alignment>,
    // container (except for text)
    #[serde(rename = "backgroundColor")]
    pub background_color: Option<String>,
    // padding
    pub top: Option<f32>,
    pub bottom: Option<f32>,
    pub left: Option<f32>,
    pub right: Option<f32>,
    // all
    pub width: Option<String>,
    pub height: Option<String>,
    pub color: Option<String>,
    #[serde(rename = "offsetTop")]
    pub offset_top: Option<f32>,
    #[serde(rename = "offsetBottom")]
    pub offset_bottom: Option<f32>,
    #[serde(rename = "offsetLeft")]
    pub offset_left: Option<f32>,
    #[serde(rename = "offsetRight")]
    pub offset_right: Option<f32>,
    #[serde(rename = "testId")]
    pub test_id: Option<String>,
    // onClick is omitted: callbacks are not serializable
}

#[derive(Deserialize, Debug, Clone)]
pub enum Alignment {
    #[serde(rename = "start")]
    Start,
    #[serde(rename = "center")]
    Center,
    #[serde(rename = "end")]
    End,
}

#[derive(Deserialize, Debug, Clone)]
pub struct UINodeDrawable {
    pub id: String,
    #[serde(alias = "type")]
    pub r#type: String,
    #[serde(alias = "parentType")]
    pub parent_type: Option<String>,
    pub props: UINodeProps,
    pub children: Vec<UINodeDrawable>,
}

pub struct UI {
    context: Context,
}

fn nf_set_timeout(_this: &JsValue, args: &[JsValue], cx: &mut Context) -> JsResult<JsValue> {
    let f = args[0].as_function().expect("failed to cast to function");
    let ms = if args.len() >= 2 {
        args[1].as_i32()
    } else {
        None
    };
    let ms = ms.unwrap_or(4);

    let handle = TIMER_ID.with(|v| v.fetch_add(1, std::sync::atomic::Ordering::SeqCst));
    let job = TimeoutJob::new(
        NativeJob::new(move |cx| {
            let handle = handle;
            let should_cancel = CLEARED_TIMERS.with(|v| {
                let mut v = v.lock().unwrap();
                v.remove(&handle)
            });
            if should_cancel {
                return Ok(JsValue::undefined());
            }

            f.call(&JsValue::undefined(), &[], cx)
        }),
        ms as u64,
    );
    cx.enqueue_job(job.into());

    Ok(JsValue::from(handle))
}

fn nf_clear_timeout(_this: &JsValue, args: &[JsValue], _cx: &mut Context) -> JsResult<JsValue> {
    if args.len() == 1 {
        let arg = args.first().unwrap();
        let arg = arg.as_i32();
        if let Some(handle) = arg {
            CLEARED_TIMERS.with(|v| {
                let mut v = v.lock().unwrap();
                v.insert(handle);
            })
        }
    }
    Ok(JsValue::null())
}

fn nf_log(
    _this: &boa_engine::JsValue,
    args: &[boa_engine::JsValue],
    _cx: &mut Context,
) -> boa_engine::JsResult<boa_engine::JsValue> {
    if let Some(msg) = args.get(0) {
        if let Some(s) = msg.as_string() {
            let s = s.to_std_string().unwrap_or_default();
            println!("[LOG] {}", s);
        }
    }
    Ok(boa_engine::JsValue::null())
}

fn build_context() -> Context {
    let mut cx = Context::default();
    {
        let id = CX_ID.with(|r| r.fetch_add(1, std::sync::atomic::Ordering::SeqCst));
        let s = format!("globalThis._cxId = {}", id);
        cx.eval(Source::from_bytes(s.as_str())).unwrap();
    }

    cx.register_global_builtin_callable(
        js_string!("setTimeout"),
        2,
        NativeFunction::from_fn_ptr(nf_set_timeout),
    )
    .expect("failed to create setTimeout fuc");
    cx.register_global_builtin_callable(
        js_string!("clearTimeout"),
        1,
        NativeFunction::from_fn_ptr(nf_clear_timeout),
    )
    .expect("failed to create clearTimeout fuc");
    cx.register_global_builtin_callable(
        js_string!("nf_log"),
        1,
        NativeFunction::from_fn_ptr(nf_log),
    )
    .expect("failed to create nf_log func");
    cx
}

impl UI {
    pub fn new(code: &str) -> Self {
        let mut this = Self {
            context: build_context(),
        };
        // this.context.set_trace(true);
        this.evaluate_impl(include_str!("../../../../packages/vm/dist/index.js"))
            .expect("Failed to evalute vm");
        this.evaluate_impl("BrrdVM.initialize()")
            .expect("Failed to initalize BrrdVM");
        this.evaluate_impl(code).expect("Failed to add ui code");
        this
    }

    pub fn evaluate(&mut self, code: &str) -> String {
        let r = self.evaluate_impl(code).expect("Failed to evaluate");
        self.flush_event_loop();
        r
    }

    pub fn create_root(&mut self) -> String {
        let id = self
            .evaluate_impl("BrrdVM.createRoot()")
            .expect("Failed to create ui root");
        self.flush_event_loop();
        id
    }

    pub fn render_root(&mut self, id: String) {
        self.evaluate_impl(&format!("BrrdVM.render('{}')", id))
            .expect("Failed to render root");
        self.flush_event_loop();
    }

    pub fn get_drawable(&mut self, id: String) -> UINodeDrawable {
        let res = self
            .evaluate_impl(&format!("BrrdVM.getDrawable('{}')", id))
            .expect("Failed to get drawable");
        let res = serde_json::from_str::<UINodeDrawable>(&res).expect("Failed to decode to json");
        self.flush_event_loop();
        res
    }

    pub fn emit_click_event(&mut self, id: String) {
        self.evaluate_impl(&format!("BrrdVM.emitClickEvent('{}')", id))
            .expect("Failed to emit click event");
        self.flush_event_loop();
    }

    fn flush_event_loop(&mut self) {
        for _ in 0..3 {
            self.context.run_jobs().unwrap();
            thread::sleep(Duration::from_millis(20));
        }
    }

    pub fn find_drawable_by_test_id(
        &self,
        drawable: &UINodeDrawable,
        test_id: &str,
    ) -> Option<UINodeDrawable> {
        if drawable
            .props
            .test_id
            .as_ref()
            .map_or(false, |id| id == test_id)
        {
            return Some(drawable.clone());
        }
        for child in &drawable.children {
            if let Some(found) = self.find_drawable_by_test_id(child, test_id) {
                return Some(found);
            }
        }
        None
    }

    fn evaluate_impl(&mut self, s: &str) -> Result<String, JsError> {
        let r = self.context.eval(Source::from_bytes(s));
        match r {
            Ok(r) => Ok(r
                .to_string(&mut self.context)
                .expect("failed to string")
                .to_std_string()
                .expect("failed to std string")),
            Err(e) => Err(e),
        }
    }
}
