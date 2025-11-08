const { useState } = React;

function PaddingAll(props) {
  return (
    <padding
      top={props.value}
      bottom={props.value}
      left={props.value}
      right={props.value}
    >
      {props.children}
    </padding>
  );
}

function Button(props) {
  return (
    <row backgroundColor="gray" onClick={props.onClick} testId={props.testId}>
      <PaddingAll value={8}>
        <row gap={4} backgroundColor="gray">
          <text text={props.prefix} />
          <text text={props.text} />
        </row>
      </PaddingAll>
    </row>
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

  return (
    <column width="100%" mainAlignment="center">
      <text text="Counter" />
      <text text={v.toString()} fontSize={32} testId="text-counter" />
      <row gap={8}>
        <Button prefix="+" text="Increment" onClick={incr} testId="btn-incr" />
        <Button prefix="-" text="Decrement" onClick={decr} testId="btn-decr" />
      </row>
    </column>
  );
}
