(function () {
  const { useState } = React;
  function PaddingAll(props) {
    return React.createElement(
      "padding",
      {
        top: props.value,
        bottom: props.value,
        left: props.value,
        right: props.value,
      },
      props.children,
    );
  }
  function Button(props) {
    return React.createElement(
      "row",
      {
        backgroundColor: "gray",
      },
      React.createElement(
        PaddingAll,
        {
          value: 8,
        },
        React.createElement(
          "row",
          {
            gap: 4,
            backgroundColor: "gray",
          },
          React.createElement("text", {
            text: props.prefix,
          }),
          React.createElement("text", {
            text: props.text,
          }),
        ),
      ),
    );
  }
  function App() {
    const [v, setV] = useState(0);
    const incr = () => {
      setV(v + 1);
    };
    const decr = () => {
      setV(v - 1);
    };
    return React.createElement(
      "column",
      {
        width: "100%",
        mainAlignment: "center",
      },
      React.createElement("text", {
        text: "Counter",
      }),
      React.createElement("text", {
        text: v.toString(),
        fontSize: 32,
      }),
      React.createElement(
        "row",
        {
          gap: 8,
        },
        React.createElement(Button, {
          prefix: "+",
          text: "Increment",
          onClick: incr,
        }),
        React.createElement(Button, {
          prefix: "-",
          text: "Decrement",
          onClick: decr,
        }),
      ),
    );
  }

  return React.createElement(App);
})();
