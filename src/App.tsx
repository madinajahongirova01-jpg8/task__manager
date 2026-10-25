import { useEffect, useState } from 'react';
import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import Board from './components/Board';
import ErrorMessage from './components/ErrorMessage';
import Filter from './components/Filter';
import Loader from './components/Loader';
import Pagination from './components/Pagination';
import TaskForm from './components/TaskForm';
import type { Filter as FilterType, Todo } from './types/todo';
import './App.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodos, setNewTodos] = useState<Todo[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [saveError, setSaveError] = useState('');
  const [adding, setAdding] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTodos(page);
        setTodos(data.todos);
        setTotal(data.total);
      } catch {
        setError('Could not load tasks');
      }
      setLoading(false);
    }
    load();
  }, [page, reload]);

  function changePage(newPage: number) {
    setLoading(true);
    setError('');
    setEditingId(null);
    setText('');
    setPage(newPage);
  }

  function retry() {
    setLoading(true);
    setError('');
    setReload(reload + 1);
  }

  async function addTask() {
    setSaveError('');
    setAdding(true);
    try {
      const created = await addTodo(text);
      const newTodo = { ...created, id: Date.now(), isLocal: true };
      setNewTodos([newTodo, ...newTodos]);
      setText('');
      if (page !== 1) {
        changePage(1);
      }
    } catch {
      setSaveError('Could not add the task');
    }
    setAdding(false);
  }

  async function saveTask(todo: Todo, newText: string, completed: boolean) {
    setSaveError('');
    setSavingId(todo.id);
    try {
      if (!todo.isLocal) {
        await updateTodo(todo.id, newText, completed);
      }
      const changed = { ...todo, todo: newText, completed: completed };
      setTodos((old) => old.map((t) => (t.id === todo.id ? changed : t)));
      setNewTodos((old) => old.map((t) => (t.id === todo.id ? changed : t)));
      setSavingId(null);
      return true;
    } catch {
      setSaveError('Could not save the task');
      setSavingId(null);
      return false;
    }
  }

  async function removeTask(todo: Todo) {
    if (!window.confirm('Delete task "' + todo.todo + '"?')) {
      return;
    }
    if (editingId === todo.id) {
      setEditingId(null);
      setText('');
    }
    setSaveError('');
    setSavingId(todo.id);
    try {
      if (!todo.isLocal) {
        await deleteTodo(todo.id);
      }
      setTodos((old) => old.filter((t) => t.id !== todo.id));
      setNewTodos((old) => old.filter((t) => t.id !== todo.id));
    } catch {
      setSaveError('Could not delete the task');
    }
    setSavingId(null);
  }

  let allTodos = todos;
  if (page === 1) {
    allTodos = [...newTodos, ...todos];
  }

  const todoTasks = allTodos.filter((t) => t.completed === false);
  const doneTasks = allTodos.filter((t) => t.completed === true);

  function startEdit(todo: Todo) {
    setEditingId(todo.id);
    setText(todo.todo);
  }

  function cancelEdit() {
    setEditingId(null);
    setText('');
  }

  async function handleSubmit() {
    if (editingId === null) {
      addTask();
      return;
    }
    const todo = allTodos.find((t) => t.id === editingId);
    if (!todo) {
      return;
    }
    const ok = await saveTask(todo, text, todo.completed);
    if (ok) {
      cancelEdit();
    }
  }

  function moveTask(todo: Todo, completed: boolean) {
    saveTask(todo, todo.todo, completed);
  }

  let totalPages = Math.ceil(total / 10);
  if (totalPages === 0) {
    totalPages = 1;
  }

  let formSaving = adding;
  if (editingId !== null) {
    formSaving = savingId === editingId;
  }

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1 className="app__title">Task Manager</h1>
          <p className="app__subtitle">Drag tasks between columns to change their status.</p>
        </div>
        {(adding || savingId !== null) && <Loader size="small" label="Saving…" />}
      </header>

      <TaskForm
        text={text}
        setText={setText}
        isEditing={editingId !== null}
        saving={formSaving}
        onSubmit={handleSubmit}
        onCancel={cancelEdit}
      />

      <div className="app__toolbar">
        <Filter
          value={filter}
          allCount={allTodos.length}
          todoCount={todoTasks.length}
          doneCount={doneTasks.length}
          onChange={setFilter}
        />
      </div>

      {saveError !== '' && <ErrorMessage message={saveError} onClose={() => setSaveError('')} />}

      <main className="app__main">
        {loading && <Loader label="Loading tasks…" />}
        {error !== '' && <ErrorMessage message={error} onRetry={retry} />}
        {!loading && error === '' && (
          <Board
            todoTasks={todoTasks}
            doneTasks={doneTasks}
            filter={filter}
            savingId={savingId}
            editingId={editingId}
            onEdit={startEdit}
            onDelete={removeTask}
            onMove={moveTask}
          />
        )}
      </main>

      <Pagination page={page} totalPages={totalPages} disabled={loading} onPageChange={changePage} />
    </div>
  );
}

export default App;
