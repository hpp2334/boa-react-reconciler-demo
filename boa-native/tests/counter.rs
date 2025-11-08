use boa_native::UI;

const CODE: &str = include_str!("../assets/counter.js");

#[test]
fn test_static_render() {
    let mut cx = UI::new(CODE);

    let id = cx.create_root();
    let assert_counter_text = |cx: &mut UI, v: &str| {
        let drawable = cx.get_drawable(id.clone());
        let counter = cx
            .find_drawable_by_test_id(&drawable, "text-counter")
            .unwrap();
        let text = counter.props.text.unwrap();
        assert_eq!(text, v);
    };
    let emit_click_event_by_test_id = |cx: &mut UI, test_id: &str| {
        let drawable = cx.get_drawable(id.clone());
        let button = cx.find_drawable_by_test_id(&drawable, test_id).unwrap();
        cx.emit_click_event(button.id);
    };

    cx.render_root(id.clone());
    assert_counter_text(&mut cx, "0");
    emit_click_event_by_test_id(&mut cx, "btn-incr");
    assert_counter_text(&mut cx, "1");
}
