import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import type { Filter, Todo } from '../types/todo';
import Column from './Column';

interface BoardProps {
  todoTasks: Todo[];
  doneTasks: Todo[];
  filter: Filter;
  savingId: number | null;
  editingId: number | null;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onMove: (todo: Todo, completed: boolean) => void;
}

function Board(props: BoardProps) {
  const mouse = useSensor(MouseSensor, { activationConstraint: { distance: 5 } });
  const touch = useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } });
  const keyboard = useSensor(KeyboardSensor);
  const sensors = useSensors(mouse, touch, keyboard);

  function handleDragEnd(event: DragEndEvent) {
    if (event.over === null) {
      return;
    }
    const allTasks = [...props.todoTasks, ...props.doneTasks];
    const todo = allTasks.find((t) => t.id === event.active.id);
    if (!todo) {
      return;
    }
    const completed = event.over.id === 'done';
    if (todo.completed !== completed) {
      props.onMove(todo, completed);
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className={props.filter === 'all' ? 'board' : 'board board--single'}>
        {props.filter !== 'done' && (
          <Column
            id="todo"
            title="To Do"
            todos={props.todoTasks}
            savingId={props.savingId}
            editingId={props.editingId}
            onEdit={props.onEdit}
            onDelete={props.onDelete}
            onMove={props.onMove}
          />
        )}
        {props.filter !== 'todo' && (
          <Column
            id="done"
            title="Done"
            todos={props.doneTasks}
            savingId={props.savingId}
            editingId={props.editingId}
            onEdit={props.onEdit}
            onDelete={props.onDelete}
            onMove={props.onMove}
          />
        )}
      </div>
    </DndContext>
  );
}

export default Board;
