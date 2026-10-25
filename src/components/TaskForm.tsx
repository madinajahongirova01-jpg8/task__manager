import type { FormEvent } from 'react';
import Loader from './Loader';

interface TaskFormProps {
  text: string;
  setText: (text: string) => void;
  isEditing: boolean;
  saving: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

function TaskForm({ text, setText, isEditing, saving, onSubmit, onCancel }: TaskFormProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (text.trim() === '' || saving) {
      return;
    }
    onSubmit();
  }

  let formClass = 'task-form';
  let label = 'New task';
  let buttonText = 'Add task';
  if (isEditing) {
    formClass = 'task-form task-form--editing';
    label = 'Edit task';
    buttonText = 'Save';
  }

  return (
    <form className={formClass} onSubmit={handleSubmit}>
      <label className="task-form__label" htmlFor="task-input">
        {label}
      </label>
      <div className="task-form__row">
        <input
          id="task-input"
          className="task-form__input"
          type="text"
          placeholder="What needs to be done?"
          value={text}
          maxLength={200}
          disabled={saving}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="btn btn--primary" disabled={text.trim() === '' || saving}>
          {saving ? <Loader size="small" label="Saving…" /> : buttonText}
        </button>
        {isEditing && (
          <button type="button" className="btn btn--ghost" disabled={saving} onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
