use std::sync::Arc;

use swc::{config::Options, try_with_handler};
use swc_common::{FileName, GLOBALS, SourceMap};

pub fn compile_jsx(jsx_code: &str) -> String {
    let cm = Arc::<SourceMap>::default();

    let c = swc::Compiler::new(cm.clone());
    let mut opts = Options::default();
    opts.config = serde_json::from_str(
        r#"
        {
          "jsc": {
            "parser": {
              "syntax": "ecmascript",
              "jsx": true
            },
            "target": "es2024",
            "loose": false,
            "minify": {
              "compress": false,
              "mangle": false
            }
          },
          "module": {
            "type": "es6"
          },
          "minify": false,
          "isModule": true
        }
        "#,
    )
    .unwrap();

    let output = GLOBALS
        .set(&Default::default(), || {
            try_with_handler(cm.clone(), Default::default(), |handler| {
                let fm = cm.new_source_file(FileName::Anon.into(), jsx_code.to_string());

                c.process_js_file(fm, handler, &opts)
            })
        })
        .unwrap();

    output.code
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_simple_jsx_compilation() {
        let jsx_code = r#"
function App() {
  return <div>Hello World</div>;
}
"#;

        let result = compile_jsx(jsx_code);

        // The result should contain React.createElement calls
        assert!(result.contains("React.createElement"));
        assert!(result.contains("div"));
        assert!(result.contains("Hello World"));
    }
}
