use boa_native_core::{UI, UINodeDrawable};

pub struct TestContext {
    root_id: String,
    ui: UI,
}

impl TestContext {
    pub fn new(code: impl AsRef<str>) -> Self {
        let mut ui = UI::new(code.as_ref());
        let root_id = ui.create_root();
        ui.render_root(root_id.clone());

        Self { root_id, ui }
    }

    pub fn find_drawable_by_test_id(&mut self, test_id: impl AsRef<str>) -> UINodeDrawable {
        let drawable = self.ui.get_drawable(self.root_id.clone());
        let v = self
            .ui
            .find_drawable_by_test_id(&drawable, test_id.as_ref())
            .unwrap();
        v
    }
    pub fn emit_click_event_by_test_id(&mut self, test_id: impl AsRef<str>) {
        let drawable = self.ui.get_drawable(self.root_id.clone());
        let button = self
            .ui
            .find_drawable_by_test_id(&drawable, test_id.as_ref())
            .unwrap();
        self.ui.emit_click_event(button.id);
    }

    pub fn emit_input_event_by_test_id(&mut self, test_id: impl AsRef<str>, value: impl ToString) {
        let drawable = self.ui.get_drawable(self.root_id.clone());
        let button = self
            .ui
            .find_drawable_by_test_id(&drawable, test_id.as_ref())
            .unwrap();
        self.ui.emit_input_event(button.id, value.to_string());
    }

    pub fn assert_text(&mut self, test_id: impl AsRef<str>, expected: impl AsRef<str>) {
        let counter = self.find_drawable_by_test_id(test_id);
        let text = counter.props.text.unwrap();
        assert_eq!(text, expected.as_ref());
    }
}
