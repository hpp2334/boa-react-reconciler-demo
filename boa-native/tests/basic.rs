use boa_native::UI;


#[test]
fn test_static_render() {
    let mut cx = UI::new();

    cx.evaluate(r#"
    var a = 0;
    setTimeout(() => {
        a = 1;
    }, 10);
"#);
    let r = cx.evaluate("a");

    assert_eq!(r, "1");
}
