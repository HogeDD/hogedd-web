"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ListTasksResponse, Task } from "@/app/lib/tasks";

type LoadState = "idle" | "loading" | "ready" | "error";

export function TasksClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [message, setMessage] = useState("Loading tasks from Go API...");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completedCount = useMemo(() => tasks.filter((task) => task.completed).length, [tasks]);

  async function fetchTasks() {
    const response = await fetch("/api/tasks", { cache: "no-store" });
    const body = (await response.json()) as ListTasksResponse | { error?: string };

    if (!response.ok) {
      throw new Error("error" in body && body.error ? body.error : "failed to load tasks");
    }

    if (!("tasks" in body)) {
      throw new Error("invalid tasks response");
    }

    return body.tasks;
  }

  function applyLoadedTasks(nextTasks: Task[]) {
    setTasks(nextTasks);
    setLoadState("ready");
    setMessage("Connected to Go API.");
  }

  function applyLoadError(error: unknown) {
    setLoadState("error");
    setMessage(error instanceof Error ? error.message : "failed to load tasks");
  }

  async function loadTasks() {
    setLoadState("loading");
    setMessage("Loading tasks from Go API...");

    try {
      applyLoadedTasks(await fetchTasks());
    } catch (error) {
      applyLoadError(error);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      setMessage("Task title is required.");
      return;
    }

    setIsSubmitting(true);
    setMessage("Creating task...");

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: normalizedTitle }),
      });
      const body = (await response.json()) as Task | { error?: string };

      if (!response.ok) {
        throw new Error("error" in body && body.error ? body.error : "failed to create task");
      }

      setTitle("");
      await loadTasks();
    } catch (error) {
      setLoadState("error");
      setMessage(error instanceof Error ? error.message : "failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function loadInitialTasks() {
      try {
        const nextTasks = await fetchTasks();
        if (active) {
          applyLoadedTasks(nextTasks);
        }
      } catch (error) {
        if (active) {
          applyLoadError(error);
        }
      }
    }

    void loadInitialTasks();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-zinc-50 px-5 py-6 text-zinc-950 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">Next.js + Go</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-normal text-zinc-950">
              Clean Tasks
            </h1>
          </div>
          <div
            className={[
              "w-fit rounded-md border px-3 py-2 text-sm font-medium",
              loadState === "ready"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : loadState === "error"
                  ? "border-rose-200 bg-rose-50 text-rose-800"
                  : "border-zinc-200 bg-white text-zinc-600",
            ].join(" ")}
          >
            {message}
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-md border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-500">Total</p>
            <p className="mt-2 text-3xl font-semibold">{tasks.length}</p>
          </div>
          <div className="rounded-md border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-500">Completed</p>
            <p className="mt-2 text-3xl font-semibold">{completedCount}</p>
          </div>
          <div className="rounded-md border border-zinc-200 bg-white p-4">
            <p className="text-sm text-zinc-500">Pending</p>
            <p className="mt-2 text-3xl font-semibold">{tasks.length - completedCount}</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <form
            onSubmit={handleSubmit}
            className="flex h-fit flex-col gap-4 rounded-md border border-zinc-200 bg-white p-5"
          >
            <div>
              <h2 className="text-base font-semibold">Create task</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-500">
                The form posts to a Next.js route handler, which forwards the request to the Go API.
              </p>
            </div>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Title
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="h-11 rounded-md border border-zinc-300 px-3 text-base outline-none transition focus:border-zinc-950"
                placeholder="Write a task"
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </form>

          <section className="rounded-md border border-zinc-200 bg-white">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
              <h2 className="text-base font-semibold">Tasks</h2>
              <button
                type="button"
                onClick={() => void loadTasks()}
                className="h-9 rounded-md border border-zinc-300 px-3 text-sm font-medium transition hover:bg-zinc-50"
              >
                Refresh
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-zinc-500">
                {loadState === "loading" ? "Loading..." : "No tasks yet."}
              </div>
            ) : (
              <ul className="divide-y divide-zinc-200">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-zinc-950">{task.title}</p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {task.id} · {new Date(task.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="w-fit rounded-md border border-zinc-200 px-2 py-1 text-xs font-medium text-zinc-600">
                      {task.completed ? "Done" : "Pending"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
