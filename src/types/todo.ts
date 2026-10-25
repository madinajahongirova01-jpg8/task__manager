export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
  isLocal?: boolean;
}

export type Filter = 'all' | 'todo' | 'done';
