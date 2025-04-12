
import React, { useEffect, useState } from "react";
import { useTaskContext, Task } from "@/contexts/TaskContext";
import { format, isAfter, parseISO, isFuture, addDays } from "date-fns";
import { AlertTriangleIcon, ClockIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

const PriorityTaskAlert: React.FC = () => {
  const { tasks } = useTaskContext();
  const [priorityTask, setPriorityTask] = useState<Task | null>(null);
  
  useEffect(() => {
    // Filter for incomplete high priority tasks with due dates
    const incompleteTasks = tasks.filter(
      task => !task.completed && task.dueDate && task.priority === "high"
    );
    
    // Sort by due date (closest first)
    const sortedTasks = incompleteTasks.sort((a, b) => {
      const dateA = parseISO(a.dueDate || "");
      const dateB = parseISO(b.dueDate || "");
      return dateA.getTime() - dateB.getTime();
    });
    
    // Find the upcoming task (either in the future or most recent)
    const upcomingTask = sortedTasks.find(task => 
      task.dueDate && isFuture(parseISO(task.dueDate))
    ) || sortedTasks[0];
    
    setPriorityTask(upcomingTask || null);
  }, [tasks]);
  
  if (!priorityTask) return null;
  
  const dueDate = parseISO(priorityTask.dueDate || "");
  const isOverdue = !isFuture(dueDate);
  
  return (
    <Card className="w-64 p-3 bg-white/80 dark:bg-retro-navy/90 backdrop-blur-sm retro-border animate-pulse-retro shadow-lg">
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="rounded-full bg-red-500 w-3 h-3 mr-2"></span>
          <h4 className="font-pixel text-xs text-red-500">
            {isOverdue ? "OVERDUE PRIORITY" : "UPCOMING PRIORITY"}
          </h4>
        </div>
        
        <h3 className="font-mono text-base mt-2 truncate">{priorityTask.title}</h3>
        
        <div className="flex items-center mt-2 text-xs font-mono">
          {isOverdue ? (
            <AlertTriangleIcon size={14} className="mr-1 text-red-500" />
          ) : (
            <ClockIcon size={14} className="mr-1 text-yellow-500" />
          )}
          <span className={isOverdue ? "text-red-500" : "text-yellow-500"}>
            {format(dueDate, "MM/dd/yyyy h:mm a")}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default PriorityTaskAlert;
