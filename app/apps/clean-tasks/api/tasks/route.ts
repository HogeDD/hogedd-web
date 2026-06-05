import { EmptyTaskTitleError, type Task } from "@/app/apps/clean-tasks/_domain/task";
import { taskService } from "@/app/apps/clean-tasks/_infrastructure/task-service";

type CreateTaskRequest = {
  title?: unknown;
};

function toTaskResponse(task: Task) {
  return {
    ...task,
    createdAt: task.createdAt.toISOString(),
  };
}

export async function GET() {
  try {
    const tasks = await taskService.listTasks();
    return Response.json({ tasks: tasks.map(toTaskResponse) });
  } catch {
    return Response.json({ error: "internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let body: CreateTaskRequest;

  try {
    body = (await request.json()) as CreateTaskRequest;
  } catch {
    return Response.json({ error: "invalid json body" }, { status: 400 });
  }

  try {
    const task = await taskService.createTask({
      title: typeof body.title === "string" ? body.title : "",
    });
    return Response.json(toTaskResponse(task), { status: 201 });
  } catch (error) {
    if (error instanceof EmptyTaskTitleError) {
      return Response.json({ error: "title must not be empty" }, { status: 400 });
    }

    return Response.json({ error: "internal server error" }, { status: 500 });
  }
}
