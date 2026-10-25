import { useDraggable } from '@dnd-kit/core';
import type { Todo } from '../types/todo';
import Loader from './Loader';

interface TaskCardProps {
  todo: Todo;
  saving: boolean;
  editing: boolean;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onMove: (todo: Todo, completed: boolean) => void;
}

function TaskCard({ todo, saving, editing, onEdit, onDelete, onMove }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: todo.id,
    disabled: saving,
  });

  let style = {};
  if (transform) {
    style = { transform: 'translate3d(' + transform.x + 'px, ' + transform.y + 'px, 0)' };
  }

  let className = 'task-card';
  if (todo.completed) {
    className = className + ' task-card--done';
  }
  if (isDragging) {
    className = className + ' task-card--dragging';
  }
  if (editing) {
    className = className + ' task-card--editing';
  }
  if (saving) {
    className = className + ' task-card--pending';
  }

  return (
    <li ref={setNodeRef} style={style} className={className} {...attributes} {...listeners}>
      <input
        type="checkbox"
        className="task-card__check"
        checked={todo.completed}
        disabled={saving}
        onChange={() => onMove(todo, !todo.completed)}
        onKeyDown={(e) => e.stopPropagation()}
      />
      <p className="task-card__text">{todo.todo}</p>
      <div className="task-card__actions" onKeyDown={(e) => e.stopPropagation()}>
        {saving && <Loader size="small" />}
        <button type="button" className="btn btn--ghost btn--small" disabled={saving} onClick={() => onEdit(todo)}>
          Edit
        </button>
        <button type="button" className="btn btn--danger btn--small" disabled={saving} onClick={() => onDelete(todo)}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskCard;
