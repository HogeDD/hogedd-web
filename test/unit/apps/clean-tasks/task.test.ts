import { describe, expect, it } from "vitest";
import { EmptyTaskTitleError, createTask } from "@/app/apps/clean-tasks/_domain/task";

describe("task domain", () => {
  it("trims the title and creates an incomplete task", () => {
    const createdAt = new Date("2026-05-28T12:00:00.000Z");

    expect(
      createTask({
        id: "task-1",
        title: "  Write tests  ",
        createdAt,
      }),
    ).toEqual({
      id: "task-1",
      title: "Write tests",
      completed: false,
      createdAt,
    });
  });

  it("rejects an empty title", () => {
    expect(() =>
      createTask({
        id: "task-1",
        title: "   ",
        createdAt: new Date(),
      }),
    ).toThrow(EmptyTaskTitleError);
  });
});
