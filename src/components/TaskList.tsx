import React, { useState } from "react";
import { PlusCircle, Clock, CalendarIcon } from "lucide-react";
import { Task, Priority, useTaskContext } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TaskItem from "./TaskItem";

interface TaskListProps {
  categoryId: string;
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ categoryId, tasks }) => {
  const { addTask, reorderTasks } = useTaskContext();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    priority: "" as Priority | "",
  });
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      // Combine date and time if both are provided
      let dueDateTime = undefined;
      if (newTask.dueDate) {
        dueDateTime = newTask.dueTime
          ? `${newTask.dueDate}T${newTask.dueTime}`
          : newTask.dueDate;
      }

      addTask({
        title: newTask.title.trim(),
        completed: false,
        categoryId,
        description: newTask.description.trim() || undefined,
        dueDate: dueDateTime,
        dueTime: newTask.dueTime || undefined,
        priority: newTask.priority as Priority | undefined,
      });

      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        dueTime: "",
        priority: "",
      });
      setIsAddingTask(false);
    }
  };

  const handleTaskDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string
  ) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const targetTaskId = e.currentTarget.getAttribute("data-task-id");

    if (!draggedTaskId || !targetTaskId || draggedTaskId === targetTaskId)
      return;

    const sourceTask = tasks.find((task) => task.id === draggedTaskId);
    const targetTask = tasks.find((task) => task.id === targetTaskId);

    if (!sourceTask || !targetTask) return;

    reorderTasks(
      categoryId,
      categoryId,
      sourceTask.position,
      targetTask.position
    );

    setDraggedTaskId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-sm text-gray-600 dark:text-gray-400">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </h3>

        <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
          <DialogTrigger asChild>
            <Button className="bg-white dark:bg-retro-navy text-gray-700 h-8 px-2 text-xs font-mono border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
              <PlusCircle size={20} className="mr-1" />
              <span className="text-lg">Add Task</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="retro-card dark:crt-overlay max-w-md w-full">
            <DialogHeader>
              <DialogTitle className="font-pixel text-base">
                Add New Task
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="new-task-title" className="font-mono">
                  Title
                </Label>
                <Input
                  id="new-task-title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="retro-input"
                  autoFocus
                  placeholder="Enter task title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-task-description" className="font-mono">
                  Description (optional)
                </Label>
                <Textarea
                  id="new-task-description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="retro-input min-h-[80px]"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="new-task-duedate"
                    className="font-mono flex items-center"
                  >
                    <CalendarIcon size={16} className="mr-1" />
                    Due Date
                  </Label>
                  <Input
                    id="new-task-duedate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                    className="retro-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="new-task-duetime"
                    className="font-mono flex items-center"
                  >
                    <Clock size={16} className="mr-1" />
                    Due Time
                  </Label>
                  <Input
                    id="new-task-duetime"
                    type="time"
                    value={newTask.dueTime}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueTime: e.target.value })
                    }
                    className="retro-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-task-priority" className="font-mono">
                  Priority
                </Label>
                <Select
                  value={newTask.priority || "none"}
                  onValueChange={(value) =>
                    setNewTask({
                      ...newTask,
                      priority: value === "none" ? "" : (value as Priority),
                    })
                  }
                >
                  <SelectTrigger id="new-task-priority" className="retro-input">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddingTask(false)}
                  className="font-mono"
                >
                  Cancel
                </Button>
                <Button onClick={handleAddTask} className="retro-btn">
                  Add Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-task-id={task.id}
          >
            <TaskItem
              task={task}
              onDragStart={(e) => handleTaskDragStart(e, task.id)}
            />
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-retro-navy/50">
            <PlusCircle className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-600 mb-2" />
            <p className="font-mono text-sm text-gray-500 dark:text-gray-400">
              No tasks yet. Add your first task!
            </p>
            <Button
              onClick={() => setIsAddingTask(true)}
              className="mt-3 retro-btn"
              size="sm"
            >
              Add Task
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
