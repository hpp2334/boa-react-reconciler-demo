use boa_native_tests::TestContext;

const CODE: &str = include_str!("../../../../packages/demo/src/presets/impl/code/todo_list.jsx");

#[test]
fn test_todo_app() {
    let mut cx = TestContext::new(CODE);

    cx.assert_text("text-cnt", "Total Todos: 0");
    cx.emit_input_event_by_test_id("input-todo", "Have breakfast");
    cx.emit_click_event_by_test_id("btn-add");
    cx.assert_text("text-cnt", "Total Todos: 1");
    cx.assert_text("btn-text-0", "Have breakfast");
    cx.emit_input_event_by_test_id("input-todo", "Have dinner");
    cx.emit_click_event_by_test_id("btn-add");
    cx.assert_text("text-cnt", "Total Todos: 2");
    cx.assert_text("btn-text-0", "Have breakfast");
    cx.assert_text("btn-text-1", "Have dinner");
    cx.emit_click_event_by_test_id("btn-remove-0");
    cx.assert_text("text-cnt", "Total Todos: 1");
    cx.assert_text("btn-text-1", "Have dinner");
}
