const { useState } = React;

let _tid = 0;

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

function TodoItem(props) {
  return (
    <row width="100%" backgroundColor="lightgray" gap={8}>
      <text text={props.text} fontSize={16} testId={`btn-text-${props.id}`} />
      <Button
        prefix="×"
        text="Remove"
        onClick={props.onRemove}
        testId={`btn-remove-${props.id}`}
      />
    </row>
  );
}

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState("");

  const addTodo = () => {
    if (inputText.trim()) {
      setTodos([...todos, { id: _tid++, text: inputText }]);
      setInputText("");
    }
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <column width="100%" mainAlignment="center">
      <text text="Todo List" fontSize={24} />
      <row gap={8} width="100%">
        <input
          value={inputText}
          onInput={(value) => setInputText(value)}
          placeholder="Enter a todo..."
          testId="input-todo"
        />
        <Button prefix="+" text="Add" onClick={addTodo} testId="btn-add" />
      </row>
      <column gap={4} width="100%">
        <text text={`Total Todos: ${todos.length}`} testId="text-cnt" />
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            text={todo.text}
            onRemove={() => removeTodo(todo.id)}
          />
        ))}
      </column>
    </column>
  );
}

function App() {
  return <TodoList />;
}
