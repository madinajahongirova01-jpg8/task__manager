import type { Todo } from '../types/todo';

const URL = 'https://dummyjson.com/todos';

export async function getTodos(page: number) {
  const skip = (page - 1) * 10;
  const res = await fetch(URL + '?limit=10&skip=' + skip);
  if (!res.ok) {
    throw new Error('Could not load tasks');
  }
  const data: { todos: Todo[]; total: number } = await res.json();
  return data;
}

export async function addTodo(text: string) {
  const res = await fetch(URL + '/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ todo: text, completed: false, userId: 1 }),
  });
  if (!res.ok) {
    throw new Error('Could not add the task');
  }
  const data: Todo = await res.json();
  return data;
}

export async function updateTodo(id: number, todo: string, completed: boolean) {
  const res = await fetch(URL + '/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ todo: todo, completed: completed }),
  });
  if (!res.ok) {
    throw new Error('Could not save the task');
  }
}

export async function deleteTodo(id: number) {
  const res = await fetch(URL + '/' + id, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error('Could not delete the task');
  }
}
