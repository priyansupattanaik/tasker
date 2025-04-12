
import React, { useState } from "react";
import { Pencil, Trash2, GripVertical, Calendar, AlertTriangle, Clock } from "lucide-react";
import { Task, Priority, useTaskContext } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, isAfter, parseISO, isToday, isTomorrow } from "date-fns";

interface TaskItemProps {
  task: Task;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onDragStart }) => {
  const { updateTask, deleteTask } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  const isOverdue = task.dueDate && isAfter(new Date(), parseISO(task.dueDate));

  // Split date and time for editing
  const [editDate, editTime] = task.dueDate 
    ? task.dueDate.split('T') 
    : ["", ""];

  // Initialize with split values
  React.useEffect(() => {
    setEditedTask({
      ...task,
      dueDate: editDate,
      dueTime: editTime
    });
  }, [task, isEditing, editDate, editTime]);

  const handleComplete = () => {
    updateTask(task.id, { completed: !task.completed });
  };

  const handleSaveEdit = () => {
    if (editedTask.title.trim()) {
      // Combine date and time if both are provided
      let dueDateTime = undefined;
      if (editedTask.dueDate) {
        dueDateTime = editedTask.dueTime 
          ? `${editedTask.dueDate}T${editedTask.dueTime}` 
          : editedTask.dueDate;
      }

      updateTask(task.id, { 
        title: editedTask.title.trim(),
        description: editedTask.description?.trim(),
        dueDate: dueDateTime,
        dueTime: editedTask.dueTime,
        priority: editedTask.priority
      });
      
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const getPriorityColor = (priority: Priority | undefined) => {
    switch (priority) {
      case "high": return "text-red-500";
      case "medium": return "text-orange-500";
      case "low": return "text-green-500";
      default: return "";
    }
  };

  // Function to format the date and time in a friendly way
  const formatDateTime = (dateTimeStr: string) => {
    const date = parseISO(dateTimeStr);
    const hasTime = dateTimeStr.includes('T');
    
    let dateDisplay = "";
    if (isToday(date)) {
      dateDisplay = "Today";
    } else if (isTomorrow(date)) {
      dateDisplay = "Tomorrow";
    } else {
      dateDisplay = format(date, "MMM d, yyyy");
    }
    
    if (hasTime) {
      return `${dateDisplay} at ${format(date, "h:mm a")}`;
    } else {
      return dateDisplay;
    }
  };

  return (
    <div 
      className={`mb-2 flex items-start p-3 rounded retro-border ${task.completed ? "opacity-60" : ""} ${isOverdue && !task.completed ? "border-red-500 dark:border-red-500" : ""}`}
      draggable
      onDragStart={onDragStart}
      data-task-id={task.id}
    >
      <div className="mr-2 pt-1">
        <GripVertical size={16} className="cursor-grab active:cursor-grabbing text-gray-500" />
      </div>
      
      <Checkbox 
        checked={task.completed}
        onCheckedChange={handleComplete}
        className="mr-3 mt-1"
      />
      
      <div className="flex-grow">
        <div className={`font-mono text-base ${task.completed ? "line-through" : ""}`}>
          {task.title}
        </div>
        
        {task.description && (
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 font-mono">
            {task.description}
          </div>
        )}
        
        <div className="flex items-center mt-2 space-x-4">
          {task.dueDate && (
            <div className={`text-xs font-mono flex items-center ${isOverdue && !task.completed ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}>
              {task.dueDate.includes('T') ? (
                <Clock size={12} className="mr-1" />
              ) : (
                <Calendar size={12} className="mr-1" />
              )}
              {formatDateTime(task.dueDate)}
              {isOverdue && !task.completed && (
                <AlertTriangle size={12} className="ml-1 text-red-500" />
              )}
            </div>
          )}
          
          {task.priority && (
            <div className={`text-xs font-mono ${getPriorityColor(task.priority)}`}>
              Priority: {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex">
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setIsEditing(true)}
            >
              <Pencil size={15} />
            </Button>
          </DialogTrigger>
          <DialogContent className="retro-card dark:crt-overlay">
            <DialogHeader>
              <DialogTitle className="font-pixel text-base">Edit Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="task-title" className="font-mono">Title</Label>
                <Input 
                  id="task-title"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                  className="retro-input"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description" className="font-mono">Description (optional)</Label>
                <Textarea 
                  id="task-description"
                  value={editedTask.description || ""}
                  onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                  className="retro-input min-h-[80px]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task-duedate" className="font-mono flex items-center">
                    <Calendar size={16} className="mr-1" />
                    Due Date
                  </Label>
                  <Input 
                    id="task-duedate"
                    type="date"
                    value={editedTask.dueDate || ""}
                    onChange={(e) => setEditedTask({...editedTask, dueDate: e.target.value})}
                    className="retro-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-duetime" className="font-mono flex items-center">
                    <Clock size={16} className="mr-1" />
                    Due Time
                  </Label>
                  <Input 
                    id="task-duetime"
                    type="time"
                    value={editedTask.dueTime || ""}
                    onChange={(e) => setEditedTask({...editedTask, dueTime: e.target.value})}
                    className="retro-input"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-priority" className="font-mono">Priority</Label>
                <Select 
                  value={editedTask.priority || "none"}
                  onValueChange={(value) => setEditedTask({...editedTask, priority: value === "none" ? undefined : value as Priority})}
                >
                  <SelectTrigger id="task-priority" className="retro-input">
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
                  onClick={() => setIsEditing(false)}
                  className="font-mono"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveEdit}
                  className="retro-btn"
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={handleDelete}
        >
          <Trash2 size={15} />
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
