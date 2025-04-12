
import React, { createContext, useContext, useEffect, useState } from "react";

// Define our task and category types
export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  categoryId: string;
  description?: string;
  dueDate?: string;
  dueTime?: string; // Added dueTime property
  priority?: Priority;
  position: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  position: number;
}

interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  addTask: (task: Omit<Task, "id" | "position">) => void;
  updateTask: (id: string, taskData: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addCategory: (category: Omit<Category, "id" | "position">) => void;
  updateCategory: (id: string, categoryData: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  reorderTasks: (sourceId: string, destinationId: string, sourceIndex: number, destinationIndex: number) => void;
  reorderCategories: (sourceIndex: number, destinationIndex: number) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Default categories with retro colors and icons
const defaultCategories: Category[] = [
  { id: "cat-1", name: "Work", color: "#9b87f5", icon: "Briefcase", position: 0 },
  { id: "cat-2", name: "Personal", color: "#1EAEDB", icon: "User", position: 1 },
  { id: "cat-3", name: "Ideas", color: "#FF69B4", icon: "Lightbulb", position: 2 }
];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("retroTaskerTasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem("retroTaskerCategories");
    return savedCategories ? JSON.parse(savedCategories) : defaultCategories;
  });

  // Save tasks and categories to localStorage when they change
  useEffect(() => {
    localStorage.setItem("retroTaskerTasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("retroTaskerCategories", JSON.stringify(categories));
  }, [categories]);

  // Task management functions
  const addTask = (task: Omit<Task, "id" | "position">) => {
    const categoryTasks = tasks.filter(t => t.categoryId === task.categoryId);
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      position: categoryTasks.length
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => (task.id === id ? { ...task, ...taskData } : task))
    );
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (!taskToDelete) return;
    
    // Delete the task
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    // Update positions for remaining tasks in the same category
    const updatedTasks = filteredTasks.map(task => {
      if (task.categoryId === taskToDelete.categoryId && task.position > taskToDelete.position) {
        return { ...task, position: task.position - 1 };
      }
      return task;
    });
    
    setTasks(updatedTasks);
  };

  // Category management functions
  const addCategory = (category: Omit<Category, "id" | "position">) => {
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
      position: categories.length,
      icon: category.icon || "Folder" // Default icon
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, categoryData: Partial<Category>) => {
    setCategories(prev =>
      prev.map(category => (category.id === id ? { ...category, ...categoryData } : category))
    );
  };

  const deleteCategory = (id: string) => {
    const categoryToDelete = categories.find(c => c.id === id);
    if (!categoryToDelete) return;
    
    // Delete the category
    const filteredCategories = categories.filter(category => category.id !== id);
    
    // Update positions for remaining categories
    const updatedCategories = filteredCategories.map(category => {
      if (category.position > categoryToDelete.position) {
        return { ...category, position: category.position - 1 };
      }
      return category;
    });
    
    // Delete all tasks in this category
    const updatedTasks = tasks.filter(task => task.categoryId !== id);
    
    setCategories(updatedCategories);
    setTasks(updatedTasks);
  };

  // Drag and drop reordering functions
  const reorderTasks = (
    sourceCategoryId: string,
    destinationCategoryId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    // Get the tasks for the source and destination categories
    const sourceItems = tasks.filter(task => task.categoryId === sourceCategoryId)
      .sort((a, b) => a.position - b.position);
    
    if (sourceItems.length <= sourceIndex) return;
    
    // If moving within the same category
    if (sourceCategoryId === destinationCategoryId) {
      const newItems = [...sourceItems];
      const [removed] = newItems.splice(sourceIndex, 1);
      newItems.splice(destinationIndex, 0, removed);
      
      // Update positions
      const updatedTasks = tasks.map(task => {
        if (task.categoryId === sourceCategoryId) {
          const index = newItems.findIndex(t => t.id === task.id);
          return { ...task, position: index };
        }
        return task;
      });
      
      setTasks(updatedTasks);
    } 
    // If moving to a different category
    else {
      const destinationItems = tasks.filter(task => task.categoryId === destinationCategoryId)
        .sort((a, b) => a.position - b.position);
      
      // Get the task being moved
      const [movedTask] = sourceItems.splice(sourceIndex, 1);
      
      // Insert it into the destination category
      const updatedTask = { ...movedTask, categoryId: destinationCategoryId };
      
      // Update positions for all affected tasks
      const updatedTasks = tasks.map(task => {
        // If it's the moved task
        if (task.id === movedTask.id) {
          return { ...task, position: destinationIndex, categoryId: destinationCategoryId };
        }
        // If it's a task in the source category
        else if (task.categoryId === sourceCategoryId && task.position > sourceIndex) {
          return { ...task, position: task.position - 1 };
        }
        // If it's a task in the destination category
        else if (task.categoryId === destinationCategoryId && task.position >= destinationIndex) {
          return { ...task, position: task.position + 1 };
        }
        return task;
      });
      
      setTasks(updatedTasks);
    }
  };

  const reorderCategories = (sourceIndex: number, destinationIndex: number) => {
    const orderedCategories = [...categories].sort((a, b) => a.position - b.position);
    const [removed] = orderedCategories.splice(sourceIndex, 1);
    orderedCategories.splice(destinationIndex, 0, removed);
    
    // Update positions
    const updatedCategories = orderedCategories.map((category, index) => ({
      ...category,
      position: index
    }));
    
    setCategories(updatedCategories);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        addTask,
        updateTask,
        deleteTask,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderTasks,
        reorderCategories
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
