import type { Task } from "@/app/apps/clean-tasks/_domain/task";
import { taskService } from "@/app/apps/clean-tasks/_infrastructure/task-service";
import { TaskNotFoundError } from "@/app/apps/clean-tasks/_usecases/task-service";

function toTaskResponse(task: Task) {
  return {
    ...task,
    createdAt: task.createdAt.toISOString(),
  };
}

export async function PATCH(
  _request: Request,
  context: RouteContext<"/apps/clean-tasks/api/tasks/[taskId]/complete">,
) {
  const { taskId } = await context.params;

  try {
    const task = await taskService.completeTask(taskId);
    return Response.json(toTaskResponse(task));
  } catch (error) {
    if (error instanceof TaskNotFoundError) {
      return Response.json({ error: "task not found" }, { status: 404 });
    }

    return Response.json({ error: "internal server error" }, { status: 500 });
  }
}
