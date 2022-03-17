export type ResponseCode = number;

export interface NewTodo {
  title: String;
  description: String;
  done: boolean;
}

export interface Todo {
  id: number;
  title: String;
  description: String;
  done: boolean;
}