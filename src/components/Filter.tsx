import type { Filter as FilterType } from '../types/todo';

interface FilterProps {
  value: FilterType;
  allCount: number;
  todoCount: number;
  doneCount: number;
  onChange: (value: FilterType) => void;
}

function Filter({ value, allCount, todoCount, doneCount, onChange }: FilterProps) {
  return (
    <div className="filter" role="group" aria-label="Filter by status">
      <button
        type="button"
        className={value === 'all' ? 'filter__button filter__button--active' : 'filter__button'}
        onClick={() => onChange('all')}
      >
        All<span className="filter__count">{allCount}</span>
      </button>
      <button
        type="button"
        className={value === 'todo' ? 'filter__button filter__button--active' : 'filter__button'}
        onClick={() => onChange('todo')}
      >
        To Do<span className="filter__count">{todoCount}</span>
      </button>
      <button
        type="button"
        className={value === 'done' ? 'filter__button filter__button--active' : 'filter__button'}
        onClick={() => onChange('done')}
      >
        Done<span className="filter__count">{doneCount}</span>
      </button>
    </div>
  );
}

export default Filter;
