"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/schemas";

interface TaskItemProps {
  task: Task;
}

const statusConfig = {
  todo: { label: "To Do", color: "bg-slate-500/20 text-slate-400 border-slate-500/30", icon: "○" },
  in_progress: { label: "In Progress", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: "◐" },
  done: { label: "Done", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: "✓" },
  blocked: { label: "Blocked", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: "✕" },
};

const priorityConfig = {
  low: { label: "Low", color: "text-slate-400" },
  medium: { label: "Medium", color: "text-blue-400" },
  high: { label: "High", color: "text-orange-400" },
  critical: { label: "Critical", color: "text-red-400" },
};

export function TaskItem({ task }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <div className="rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 overflow-hidden">
      {/* Task header */}
      <div
        className="p-4 cursor-pointer hover:bg-slate-800/80 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-4">
          {/* Status icon */}
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold shrink-0",
              status.color
            )}
          >
            {status.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h4 className="text-base font-semibold text-white truncate">
                {task.title}
              </h4>
              <span
                className={cn(
                  "px-2 py-0.5 text-xs font-medium rounded border",
                  status.color
                )}
              >
                {status.label}
              </span>
            </div>

            <p className="text-sm text-slate-400 line-clamp-2 mb-2">
              {task.description}
            </p>

            <div className="flex items-center gap-4 text-xs">
              <span className={cn("font-medium", priority.color)}>
                {priority.label} Priority
              </span>
              {totalSubtasks > 0 && (
                <span className="text-slate-500">
                  {completedSubtasks}/{totalSubtasks} subtasks
                </span>
              )}
            </div>
          </div>

          {/* Expand icon */}
          {task.subtasks.length > 0 && (
            <svg
              className={cn(
                "w-5 h-5 text-slate-400 transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>

      {/* Subtasks (expandable) */}
      {isExpanded && task.subtasks.length > 0 && (
        <div className="border-t border-slate-700/50 bg-slate-900/30">
          <div className="p-4 space-y-3">
            {task.subtasks.map((subtask, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50"
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-md flex items-center justify-center text-xs shrink-0 mt-0.5",
                    subtask.completed
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-slate-700 text-slate-500 border border-slate-600"
                  )}
                >
                  {subtask.completed ? "✓" : ""}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      subtask.completed ? "text-slate-500 line-through" : "text-white"
                    )}
                  >
                    {subtask.title}
                  </p>
                  {subtask.description && (
                    <p className="text-xs text-slate-500 mt-1">
                      {subtask.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
