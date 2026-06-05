export type Task = Readonly<{
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}>;

export class EmptyTaskTitleError extends Error {
  constructor() {
    super("task title must not be empty");
    this.name = "EmptyTaskTitleError";
  }
}

type CreateTaskInput = {
  id: string;
  title: string;
  createdAt: Date;
};

export function createTask({ id, title, createdAt }: CreateTaskInput): Task {
  const normalizedTitle = title.trim();
  if (!normalizedTitle) {
    throw new EmptyTaskTitleError();
  }

  return {
    id,
    title: normalizedTitle,
    completed: false,
    createdAt,
  };
}
