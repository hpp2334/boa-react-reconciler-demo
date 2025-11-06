use boa_native::UI;

const CODE: &str = include_str!("../assets/counter.js");

#[test]
fn test_static_render() {
    let mut cx = UI::new();

    let id = cx.create_root();
    cx.render_root(id.clone(), CODE.to_string());
    let drawable = cx.get_drawable(id.clone());

    assert_eq!("", format!("{:?}", drawable));
}
