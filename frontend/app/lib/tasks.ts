export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export type ListTasksResponse = {
  tasks: Task[];
};

export type CreateTaskRequest = {
  title: string;
};
