"use client";

import { useState } from "react";

interface AddTaskProps {
  onAdd: () => void;
}

export default function AddTask({ onAdd }: AddTaskProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("general");
  const [assignee, setAssignee] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, priority, category, assignee: assignee || null }),
    });
    setTitle("");
    setLoading(false);
    onAdd();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 bg-zinc-800 text-white rounded-lg px-4 py-2 border border-zinc-700 focus:outline-none focus:border-zinc-500"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="bg-zinc-800 text-white rounded-lg px-3 py-2 border border-zinc-700 focus:outline-none"
      >
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-zinc-800 text-white rounded-lg px-3 py-2 border border-zinc-700 focus:outline-none"
      >
        <option value="general">General</option>
        <option value="taskboard">Taskboard</option>
        <option value="website">Website</option>
        <option value="automation">Automation</option>
        <option value="research">Research</option>
      </select>
      <select
        value={assignee}
        onChange={(e) => setAssignee(e.target.value)}
        className="bg-zinc-800 text-white rounded-lg px-3 py-2 border border-zinc-700 focus:outline-none"
      >
        <option value="">Unassigned</option>
        <option value="Atlas">Atlas</option>
        <option value="Jarno">Jarno</option>
      </select>
      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="bg-white text-black font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 disabled:opacity-50"
      >
        {loading ? "..." : "Add"}
      </button>
    </form>
  );
}
