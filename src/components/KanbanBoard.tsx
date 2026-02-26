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

const columns = [
  { id: "todo", label: "To Do", color: "border-zinc-500" },
  { id: "in-progress", label: "In Progress", color: "border-blue-500" },
  { id: "review", label: "Review", color: "border-yellow-500" },
  { id: "done", label: "Done", color: "border-green-500" },
];

const priorityColors = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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

  const filteredTasks = filter === "all" 
    ? tasks 
    : tasks.filter(t => t.priority === filter);

  if (loading) return <div className="p-4 text-zinc-400">Loading...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-4 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.id}
          className={`flex-shrink-0 w-full lg:w-72 bg-zinc-800/50 rounded-xl p-4 border-t-4 ${column.color}`}
        >
          {/* Column header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">{column.label}</h3>
            <span className="text-xs text-zinc-500 bg-zinc-700 px-2 py-1 rounded-full">
              {filteredTasks.filter((t) => t.status === column.id).length}
            </span>
          </div>

          {/* Tasks */}
          <div className="space-y-3 min-h-[200px]">
            {filteredTasks
              .filter((task) => task.status === column.id)
              .map((task) => (
                <div
                  key={task.id}
                  className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 hover:border-zinc-600 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]} flex-shrink-0 mt-1.5`} />
                    <span className="text-white text-sm font-medium flex-1">{task.title}</span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 bg-zinc-700 px-2 py-0.5 rounded">
                      {task.category}
                    </span>
                    <select
                      value={task.status}
                      onChange={(e) => updateStatus(task.id, e.target.value)}
                      className="text-xs bg-transparent text-zinc-400 hover:text-white cursor-pointer ml-auto"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
              ))}

            {filteredTasks.filter((t) => t.status === column.id).length === 0 && (
              <p className="text-zinc-600 text-sm text-center py-8">No tasks</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
