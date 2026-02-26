"use client";

import { useState } from "react";
import KanbanBoard from "@/components/KanbanBoard";
import AddTask from "@/components/AddTask";
import ActivityLog from "@/components/ActivityLog";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdd = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans bg-gradient-to-br from-zinc-900 to-zinc-950 overflow-x-hidden">
      <div className="max-w-[1800px] mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">📋 Task Board</h1>
          <p className="text-zinc-400 text-sm md:text-base">Track our progress together</p>
        </header>

        {/* Add Task */}
        <section className="mb-8">
          <AddTask onAdd={handleAdd} />
        </section>

        {/* Kanban Board */}
        <section>
          <KanbanBoard key={refreshKey} />
        </section>
        
        {/* Activity Log */}
        <ActivityLog />
      </div>
    </div>
  );
}
