"use client";

import { useState } from "react";
import KanbanBoard from "@/components/KanbanBoard";
import AddTask from "@/components/AddTask";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdd = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      <div className="max-w-[1800px] mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">📋 Task Board</h1>
          <p className="text-zinc-400">Track our progress together</p>
        </header>

        {/* Add Task */}
        <section className="mb-8">
          <AddTask onAdd={handleAdd} />
        </section>

        {/* Kanban Board */}
        <section>
          <KanbanBoard key={refreshKey} />
        </section>
      </div>
    </div>
  );
}
