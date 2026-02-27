"use client";

/**
 * Todo List — useCallback + memo
 * Concepts: memo · useCallback · stable refs · when NOT to use useCallback
 */

import { useState, useCallback, useRef, memo } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

type Todo = { id: number; text: string; done: boolean };

// ── TodoItem — memo-wrapped child ─────────────────────────────────────────────
//
// memo: skips re-render if props are the same reference.
// Without memo, useCallback on the parent side is pointless.
// Without useCallback on the parent side, memo is pointless.
// They only work together.

const TodoItem = memo(function TodoItem({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  // Render counter — visible proof that memo is working.
  // When you add a new todo, existing rows keep the same count.
  const renders = useRef(0);
  renders.current += 1;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        className="h-4 w-4 cursor-pointer accent-purple-600"
      />
      <span className={`flex-1 text-sm ${todo.done ? "text-gray-400 line-through" : "text-gray-800"}`}>
        {todo.text}
      </span>
      {/* Render badge — remove in production; here to demo memo in action */}
      <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-500">
        renders: {renders.current}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-gray-300 transition-colors hover:text-red-500"
        aria-label="Delete"
      >
        ✕
      </button>
    </div>
  );
});

// ── Parent ─────────────────────────────────────────────────────────────────────

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Read the React docs",      done: true  },
    { id: 2, text: "Build a todo app",          done: false },
    { id: 3, text: "Understand useCallback",    done: false },
  ]);
  const [input, setInput] = useState("");
  const nextId = useRef(4); // stable counter — no re-render needed

  // ── Handlers passed to children — MUST be stable with useCallback ──────────
  //
  // Why [] deps work here: functional updates (prev => ...) close over the
  // setter, not over `todos` state — so there's no stale-closure risk and
  // the functions never need to be re-created.

  const handleToggle = useCallback((id: number) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }, []); // stable forever

  const handleDelete = useCallback((id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, []); // stable forever

  // ── Handler NOT passed to children — useCallback gives zero benefit here ───
  //
  // handleAdd reads `input`, so it would need [input] as a dep, meaning a
  // new function every keystroke. Since it's only used in this component's
  // own JSX (not passed down), wrapping it in useCallback would be pure overhead.
  const handleAdd = () => {
    const text = input.trim();
    if (!text) return;
    setTodos(prev => [...prev, { id: nextId.current++, text, done: false }]);
    setInput("");
  };

  const done  = todos.filter(t =>  t.done).length;
  const total = todos.length;

  return (
    <div className="space-y-4">

      {/* Add form */}
      <form
        onSubmit={e => { e.preventDefault(); handleAdd(); }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a new todo…"
          className="h-10 flex-1 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-40"
          disabled={!input.trim()}
        >
          Add
        </button>
      </form>

      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{done} of {total} complete</span>
          <span>{total === 0 ? 0 : Math.round((done / total) * 100)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-purple-500 transition-[width] duration-300"
            style={{ width: total === 0 ? "0%" : `${(done / total) * 100}%` }}
          />
        </div>
      </div>

      {/* List */}
      {todos.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-400">No todos yet — add one above.</p>
      ) : (
        <div className="space-y-2">
          {todos.map(todo => (
            // key = stable entity id, never index
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">
        Add a new item — watch existing rows keep their render count (memo is working).
      </p>
    </div>
  );
}
