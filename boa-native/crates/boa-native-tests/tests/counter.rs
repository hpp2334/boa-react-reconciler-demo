use boa_native_tests::TestContext;

const CODE: &str = include_str!("../../../../packages/demo/src/presets/impl/code/counter.jsx");

#[test]
fn test_counter_app() {
    let mut cx = TestContext::new(CODE);

    cx.assert_text("text-counter", "0");
    cx.emit_click_event_by_test_id("btn-incr");
    cx.assert_text("text-counter", "1");
    cx.emit_click_event_by_test_id("btn-decr");
    cx.assert_text("text-counter", "0");
}
