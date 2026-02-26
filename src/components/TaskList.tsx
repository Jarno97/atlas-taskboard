"use client";

import { useState, useEffect } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "high" | "medium" | "low";
  category: string;
  created: string;
  updated: string;
}

const priorityColors = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
    fetchTasks();
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`flex items-center gap-3 p-3 rounded-lg bg-zinc-800 border border-zinc-700 ${
            task.status === "done" ? "opacity-60" : ""
          }`}
        >
          {/* Status toggle */}
          <button
            onClick={() =>
              updateStatus(
                task.id,
                task.status === "done" ? "todo" : "done"
              )
            }
            className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
              task.status === "done"
                ? "bg-green-500 border-green-500"
                : "border-zinc-500 hover:border-zinc-400"
            }`}
          >
            {task.status === "done" && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* Priority dot */}
          <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]} flex-shrink-0`} />

          {/* Title */}
          <span
            className={`flex-1 ${
              task.status === "done" ? "line-through text-zinc-500" : "text-white"
            }`}
          >
            {task.title}
          </span>

          {/* Status badge */}
          <select
            value={task.status}
            onChange={(e) => updateStatus(task.id, e.target.value)}
            className="bg-zinc-700 text-xs text-zinc-300 rounded px-2 py-1 border-none"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>

          {/* Delete */}
          <button
            onClick={() => deleteTask(task.id)}
            className="text-zinc-500 hover:text-red-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}

      {tasks.length === 0 && (
        <p className="text-zinc-500 text-center py-8">No tasks yet. Add one below!</p>
      )}
    </div>
  );
}
