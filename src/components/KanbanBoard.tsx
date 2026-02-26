"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "queued" | "todo" | "in-progress" | "review" | "done";
  priority: "high" | "medium" | "low";
  category: string;
  assignee: "Atlas" | "Jarno" | null;
  created: string;
  updated: string;
}

const columns = [
  { id: "todo", label: "New", color: "border-zinc-500" },
  { id: "queued", label: "Queued", color: "border-zinc-400" },
  { id: "in-progress", label: "In Progress", color: "border-blue-500" },
  { id: "review", label: "Review", color: "border-yellow-500" },
  { id: "done", label: "Done", color: "border-green-500" },
];

const priorityColors = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

function ConfirmDialog({ 
  isOpen, 
  title, 
  onConfirm, 
  onCancel 
}: { 
  isOpen: boolean; 
  title: string; 
  onConfirm: () => void; 
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-zinc-800 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-zinc-700">
        <h3 className="text-lg font-semibold text-white mb-2">Delete task?</h3>
        <p className="text-zinc-400 mb-6">
          Are you sure you want to delete <span className="text-white font-medium">"{title}"</span>?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function EditDialog({ 
  isOpen, 
  task, 
  onSave, 
  onCancel 
}: { 
  isOpen: boolean; 
  task: Task | null; 
  onSave: (title: string, priority: string, category: string) => void; 
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("general");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setPriority(task.priority);
      setCategory(task.category);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-zinc-800 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-zinc-700">
        <h3 className="text-lg font-semibold text-white mb-4">Edit Task</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-700 text-white rounded-lg px-4 py-2 border border-zinc-600 focus:outline-none focus:border-zinc-400"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-zinc-700 text-white rounded-lg px-4 py-2 border border-zinc-600 focus:outline-none focus:border-zinc-400"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-zinc-700 text-white rounded-lg px-4 py-2 border border-zinc-600 focus:outline-none focus:border-zinc-400"
            >
              <option value="general">General</option>
              <option value="taskboard">Taskboard</option>
              <option value="website">Website</option>
              <option value="automation">Automation</option>
              <option value="research">Research</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(title, priority, category)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: string; title: string }>({ show: false, id: "", title: "" });
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [filterAssignee, setFilterAssignee] = useState<"all" | "Atlas" | "Jarno">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, status: string, assignee?: string) => {
    const updates: any = { status };
    if (assignee !== undefined) updates.assignee = assignee || null;
    
    await fetch("/api/tasks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    fetchTasks();
  };

  const confirmDelete = (id: string, title: string) => {
    setDeleteConfirm({ show: true, id, title });
  };

  const handleEdit = (task: Task) => {
    setEditTask(task);
  };

  const handleSaveEdit = async (title: string, priority: string, category: string) => {
    if (editTask) {
      await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editTask.id, title, priority, category }),
      });
      fetchTasks();
      setEditTask(null);
    }
  };

  const handleDelete = async () => {
    await fetch(`/api/tasks?id=${deleteConfirm.id}`, { method: "DELETE" });
    setDeleteConfirm({ show: false, id: "", title: "" });
    fetchTasks();
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    
    if (taskId && draggedTask) {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.status !== status) {
        updateStatus(taskId, status);
      }
    }
    setDraggedTask(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col sm:flex-row gap-3 pb-4 overflow-x-auto">
        {columns.map((col) => (
          <div key={col.id} className="w-full sm:w-64 md:w-72 lg:w-80 bg-zinc-800/50 rounded-xl p-4 md:p-5 flex-shrink-0">
            <div className="h-6 w-20 bg-zinc-700 rounded animate-pulse mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-zinc-800 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <ConfirmDialog
        isOpen={deleteConfirm.show}
        title={deleteConfirm.title}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ show: false, id: "", title: "" })}
      />

      <EditDialog
        isOpen={!!editTask}
        task={editTask}
        onSave={handleSaveEdit}
        onCancel={() => setEditTask(null)}
      />

      {/* Search and Filter */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 max-w-xs bg-zinc-800 text-white rounded-lg px-4 py-2 border border-zinc-700 focus:outline-none focus:border-zinc-500 text-sm"
        />
        <select
          value={filterAssignee}
          onChange={(e) => setFilterAssignee(e.target.value as any)}
          className="bg-zinc-800 text-white rounded-lg px-3 py-2 border border-zinc-700 focus:outline-none text-sm"
        >
          <option value="all">All</option>
          <option value="Atlas">My tasks</option>
          <option value="Jarno">Jarno's</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-zinc-800 text-white rounded-lg px-3 py-2 border border-zinc-700 focus:outline-none text-sm"
        >
          <option value="all">All Projects</option>
          <option value="general">General</option>
          <option value="taskboard">Taskboard</option>
          <option value="website">Website</option>
          <option value="automation">Automation</option>
          <option value="research">Research</option>
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pb-4 overflow-x-auto">
        {columns.map((column) => (
          <div
            key={column.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
            className={`w-full sm:flex-shrink-0 sm:w-64 md:w-72 lg:w-80 bg-zinc-800/50 rounded-xl p-4 md:p-5 border-t-4 ${column.color} ${draggedTask ? 'overflow-visible' : ''}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">{column.label}</h3>
              <span className="text-sm text-zinc-500 bg-zinc-700 px-2 py-1 rounded-full">
                {tasks.filter((t) => t.status === column.id && (filterAssignee === "all" || t.assignee === filterAssignee) && (!searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()))).length}
              </span>
            </div>

            <div className="space-y-3 min-h-[200px]">
              {tasks
                .filter((task) => {
                  if (filterAssignee === "all") return true;
                  return task.assignee === filterAssignee;
                })
                .filter((task) => {
                  if (filterCategory === "all") return true;
                  return task.category === filterCategory;
                })
                .filter((task) => {
                  if (!searchQuery) return true;
                  return task.title.toLowerCase().includes(searchQuery.toLowerCase());
                })
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <motion.div
                    key={task.id}
                    draggable
                    onDragStart={() => setDraggedTask(task.id)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`task-card bg-zinc-800 rounded-lg p-4 md:p-5 border border-zinc-700 hover:border-zinc-600 transition-colors cursor-grab active:cursor-grabbing group ${
                      draggedTask === task.id ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]} flex-shrink-0 mt-1.5`} />
                      <span className="text-white text-sm font-medium flex-1">{task.title}</span>
                      <button
                        onClick={() => handleEdit(task)}
                        className="text-zinc-500 hover:text-blue-400 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => confirmDelete(task.id, task.title)}
                        className="text-zinc-500 hover:text-red-400 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-500 bg-zinc-700 px-2 py-0.5 rounded">
                        {task.category}
                      </span>
                      <select
                        value={task.assignee || ""}
                        onChange={(e) => updateStatus(task.id, task.status, e.target.value as any)}
                        style={{ backgroundColor: '#3f3f46', color: '#d4d4d8' }}
                        className="text-sm cursor-pointer rounded px-2 py-1.5 border-none"
                      >
                        <option value="" style={{ backgroundColor: '#3f3f46', color: '#d4d4d8' }}>Assign</option>
                        <option value="Atlas" style={{ backgroundColor: '#3f3f46', color: '#d4d4d8' }}>Atlas</option>
                        <option value="Jarno" style={{ backgroundColor: '#3f3f46', color: '#d4d4d8' }}>Jarno</option>
                      </select>
                      <select
                        value={task.status}
                        onChange={(e) => updateStatus(task.id, e.target.value)}
                        style={{ backgroundColor: '#3f3f46', color: '#d4d4d8' }}
                        className="text-sm cursor-pointer rounded px-2 py-1.5 border-none"
                      >
                        <option value="todo" style={{ backgroundColor: '#3f3f46', color: '#d4d4d8' }}>New</option>
                        <option value="queued" style={{ backgroundColor: '#3f3f46', color: '#d4d4d8' }}>Queued</option>
                        <option value="in-progress" style={{ backgroundColor: '#3f3f46', color: '#d4d4d8' }}>In Progress</option>
                        <option value="review" style={{ backgroundColor: '#3f3f46', color: '#d4d4d8' }}>Review</option>
                        <option value="done" style={{ backgroundColor: '#3f3f46', color: '#d4d4d8' }}>Done</option>
                      </select>
                    </div>
                  </motion.div>
                ))}

              {tasks.filter((t) => t.status === column.id).length === 0 && (
                <p className="text-zinc-600 text-sm text-center py-8">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
