import { useDroppable } from '@dnd-kit/core';
import type { Todo } from '../types/todo';
import TaskCard from './TaskCard';

interface ColumnProps {
  id: string;
  title: string;
  todos: Todo[];
  savingId: number | null;
  editingId: number | null;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onMove: (todo: Todo, completed: boolean) => void;
}

function Column(props: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: props.id });

  let className = 'column column--' + props.id;
  if (isOver) {
    className = className + ' column--over';
  }

  return (
    <section ref={setNodeRef} className={className}>
      <header className="column__header">
        <h2 className="column__title">{props.title}</h2>
        <span className="column__count">{props.todos.length}</span>
      </header>

      {props.todos.length === 0 && <p className="column__empty">No tasks</p>}

      {props.todos.length > 0 && (
        <ul className="column__list">
        {props.todos.map((todo) => (
          <TaskCard
            key={todo.id}
            todo={todo}
            saving={todo.id === props.savingId}
            editing={todo.id === props.editingId}
            onEdit={props.onEdit}
            onDelete={props.onDelete}
            onMove={props.onMove}
          />
        ))}
        </ul>
      )}
    </section>
  );
}

export default Column;
