export interface PresetExample {
  name: string
  description: string
  code: string
}

export const PRESET_EXAMPLES: Record<string, PresetExample> = {
  counter: {
    name: 'Counter',
    description: 'Simple counter component with increment/decrement buttons',
    code: `import React, { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f0f8ff',
      borderRadius: '8px',
      border: '2px solid #4a90e2'
    }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>
        Counter: {count}
      </h2>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => setCount(count - 1)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Decrement
        </button>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Increment
        </button>
        <button
          onClick={() => setCount(0)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}`
  },
  todoList: {
    name: 'Todo List',
    description: 'Interactive todo list with add, toggle, and delete functionality',
    code: `import React, { useState } from 'react'

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Learn React', completed: true },
    { id: 2, text: 'Learn TypeScript', completed: false },
    { id: 3, text: 'Build awesome apps', completed: false }
  ])
  const [inputValue, setInputValue] = useState('')

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: inputValue, completed: false }
      ])
      setInputValue('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '500px',
      margin: '0 auto',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '20px', textAlign: 'center' }}>
        Todo List
      </h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Add
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {todos.map(todo => (
          <div
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px',
              backgroundColor: 'white',
              border: '1px solid #dee2e6',
              borderRadius: '4px'
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              style={{ cursor: 'pointer' }}
            />
            <span
              style={{
                flex: 1,
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#6c757d' : '#2c3e50'
              }}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{
                padding: '4px 8px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {todos.length === 0 && (
        <div style={{ textAlign: 'center', color: '#6c757d', padding: '20px' }}>
          No todos yet. Add one above!
        </div>
      )}
    </div>
  )
}`
  },
  greeting: {
    name: 'Greeting Card',
    description: 'Interactive greeting card with customizable message',
    code: `import React, { useState } from 'react'

export default function GreetingCard() {
  const [name, setName] = useState('World')
  const [message, setMessage] = useState('Welcome to React!')
  const [showHeart, setShowHeart] = useState(false)

  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '12px',
      maxWidth: '400px',
      margin: '40px auto',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
        Hello, {name}!
      </h1>

      <p style={{ fontSize: '1.2rem', marginBottom: '30px', opacity: 0.9 }}>
        {message}
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          style={{
            padding: '12px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            backgroundColor: 'rgba(255,255,255,0.9)',
            color: '#333'
          }}
        />

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter a message"
          style={{
            padding: '12px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            backgroundColor: 'rgba(255,255,255,0.9)',
            color: '#333'
          }}
        />

        <button
          onClick={() => setShowHeart(!showHeart)}
          style={{
            padding: '12px 24px',
            backgroundColor: showHeart ? '#e74c3c' : '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          {showHeart ? 'Hide ❤️' : 'Show Love ❤️'}
        </button>
      </div>

      {showHeart && (
        <div style={{
          fontSize: '3rem',
          marginTop: '20px',
          animation: 'pulse 1.5s infinite'
        }}>
          ❤️
        </div>
      )}
    </div>
  )
}`
  }
}