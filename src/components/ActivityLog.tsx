"use client";

import { useState, useEffect } from "react";

interface Activity {
  id: string;
  action: string;
  taskId: string;
  taskTitle: string;
  details: string;
  timestamp: string;
}

const actionIcons: Record<string, string> = {
  created: "✨",
  status_changed: "🔄",
  assigned: "👤",
  updated: "✏️",
  deleted: "🗑️",
};

const actionLabels: Record<string, string> = {
  created: "Created",
  status_changed: "Status",
  assigned: "Assigned",
  updated: "Updated",
  deleted: "Deleted",
};

export default function ActivityLog() {
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const fetchActivity = async () => {
    const res = await fetch("/api/tasks?type=activity");
    const data = await res.json();
    setActivity(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-zinc-700 hover:bg-zinc-600 rounded-full flex items-center justify-center shadow-lg border border-zinc-600"
        title="Activity Log"
      >
        📜
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div 
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-sm h-full bg-zinc-900 border-l border-zinc-700 p-4 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Activity</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {loading ? (
                <p className="text-zinc-500">Loading...</p>
              ) : activity.length === 0 ? (
                <p className="text-zinc-500">No activity yet</p>
              ) : (
                activity.map((item) => (
                  <div key={item.id} className="text-sm">
                    <div className="flex items-center gap-2">
                      <span>{actionIcons[item.action] || "•"}</span>
                      <span className="text-zinc-400">{actionLabels[item.action] || item.action}</span>
                      <span className="text-white font-medium truncate">{item.taskTitle}</span>
                    </div>
                    <div className="text-zinc-500 text-xs ml-5">
                      {item.details} · {formatTime(item.timestamp)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
