"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

function SortableTask({ task, onDelete }: { task: Task; onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-zinc-800 rounded-lg p-4 border border-zinc-700 hover:border-zinc-600 transition-colors cursor-grab active:cursor-grabbing group ${
        isDragging ? "opacity-50 z-50 shadow-xl" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]} flex-shrink-0 mt-1.5`} />
        <span className="text-white text-sm font-medium flex-1">{task.title}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
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
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    if (newStatus === "todo" || newStatus === "in-progress" || newStatus === "review" || newStatus === "done") {
      updateStatus(taskId, newStatus);
    }
  }

  if (loading) return <div className="p-4 text-zinc-400">Loading...</div>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
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
                {tasks.filter((t) => t.status === column.id).length}
              </span>
            </div>

            {/* Tasks */}
            <SortableContext
              items={tasks.filter((t) => t.status === column.id).map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3 min-h-[200px]" data-status={column.id}>
                {tasks
                  .filter((task) => task.status === column.id)
                  .map((task) => (
                    <SortableTask key={task.id} task={task} onDelete={deleteTask} />
                  ))}

                {tasks.filter((t) => t.status === column.id).length === 0 && (
                  <p className="text-zinc-600 text-sm text-center py-8">Drop tasks here</p>
                )}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  );
}
