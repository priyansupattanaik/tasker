import React, { useState } from "react";
import { PlusCircle, FolderIcon, Filter, CalendarIcon } from "lucide-react";
import { useTaskContext, Category, Task } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CategoryItem from "./CategoryItem";
import TaskList from "./TaskList";
import IconPicker from "./IconPicker";
import DateFilter from "./DateFilter";
import { 
  isWithinInterval, 
  parseISO, 
  startOfMonth, 
  endOfMonth, 
  isValid, 
  format, 
  isSameMonth, 
  isSameYear 
} from "date-fns";

const CategoryList: React.FC = () => {
  const { categories, tasks, addCategory, reorderCategories } = useTaskContext();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#9b87f5");
  const [newCategoryIcon, setNewCategoryIcon] = useState("Folder");
  const [draggedCategoryId, setDraggedCategoryId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const sortedCategories = [...categories].sort((a, b) => a.position - b.position);

  const getTasksForCategory = (categoryId: string): Task[] => {
    return tasks
      .filter(task => {
        if (task.categoryId !== categoryId) return false;
        
        if (selectedDate && task.dueDate) {
          const taskDate = parseISO(task.dueDate);
          if (isValid(taskDate)) {
            return isSameMonth(taskDate, selectedDate) && isSameYear(taskDate, selectedDate);
          }
          return false;
        }
        
        return true;
      })
      .sort((a, b) => a.position - b.position);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory({
        name: newCategoryName.trim(),
        color: newCategoryColor,
        icon: newCategoryIcon
      });
      setNewCategoryName("");
      setNewCategoryColor("#9b87f5");
      setNewCategoryIcon("Folder");
      setIsAddingCategory(false);
    }
  };

  const handleCategoryDragStart = (e: React.DragEvent<HTMLDivElement>, categoryId: string) => {
    setDraggedCategoryId(categoryId);
    e.dataTransfer.setData("text/plain", categoryId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleCategoryDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleCategoryDrop = (e: React.DragEvent<HTMLDivElement>, targetCategoryId: string) => {
    e.preventDefault();
    
    if (!draggedCategoryId || draggedCategoryId === targetCategoryId) return;
    
    const sourceCategory = categories.find(cat => cat.id === draggedCategoryId);
    const targetCategory = categories.find(cat => cat.id === targetCategoryId);
    
    if (!sourceCategory || !targetCategory) return;
    
    reorderCategories(sourceCategory.position, targetCategory.position);
    setDraggedCategoryId(null);
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    
    if (date) {
      const newExpandedState: Record<string, boolean> = {};
      categories.forEach(category => {
        const categoryHasTasksInMonth = tasks.some(task => 
          task.categoryId === category.id && 
          task.dueDate && 
          isSameMonth(parseISO(task.dueDate), date) &&
          isSameYear(parseISO(task.dueDate), date)
        );
        
        if (categoryHasTasksInMonth) {
          newExpandedState[category.id] = true;
        }
      });
      setExpandedCategories(prev => ({...prev, ...newExpandedState}));
    }
  };

  const getFilteredTaskCount = () => {
    if (!selectedDate) return 0;
    
    return tasks.filter(task => {
      if (task.dueDate) {
        const taskDate = parseISO(task.dueDate);
        if (isValid(taskDate)) {
          return isSameMonth(taskDate, selectedDate) && isSameYear(taskDate, selectedDate);
        }
      }
      return false;
    }).length;
  };

  return (
    <div className="p-4 md:p-6 relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <h2 className="font-pixel text-base md:text-lg flex items-center">
          <FolderIcon className="mr-2 h-5 w-5" />
          Categories
        </h2>
        
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
          <DateFilter selectedDate={selectedDate} onDateChange={handleDateChange} />
          
          <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
            <DialogTrigger asChild>
              <Button className="retro-btn flex items-center">
                <PlusCircle size={16} className="mr-1" />
                <span>New Category</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="retro-card dark:crt-overlay">
              <DialogHeader>
                <DialogTitle className="font-pixel text-base">Add New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="new-category-name" className="font-mono">Name</Label>
                  <Input 
                    id="new-category-name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="retro-input"
                    autoFocus
                    placeholder="Enter category name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-category-icon" className="font-mono">Icon</Label>
                  <IconPicker 
                    selectedIcon={newCategoryIcon} 
                    onSelectIcon={setNewCategoryIcon} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-category-color" className="font-mono">Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      id="new-category-color"
                      type="color"
                      value={newCategoryColor}
                      onChange={(e) => setNewCategoryColor(e.target.value)}
                      className="w-12 h-10 cursor-pointer"
                    />
                    <Input 
                      value={newCategoryColor}
                      onChange={(e) => setNewCategoryColor(e.target.value)}
                      className="retro-input"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingCategory(false)}
                    className="font-mono"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddCategory}
                    className="retro-btn"
                  >
                    Add Category
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {selectedDate && (
        <div className="mb-4 p-3 bg-primary/10 rounded-lg font-mono text-sm">
          <div className="flex items-center justify-between">
            <div>
              <Filter className="inline-block mr-2 h-4 w-4" />
              Showing tasks for {format(selectedDate, "MMMM yyyy")}
            </div>
            <div className="font-semibold">{getFilteredTaskCount()} task(s) found</div>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {sortedCategories.map((category) => {
          const categoryTasks = getTasksForCategory(category.id);
          if (selectedDate && categoryTasks.length === 0) return null;
          
          return (
            <div 
              key={category.id}
              className="transition-all duration-200 hover:translate-x-1"
            >
              <CategoryItem 
                category={category}
                isExpanded={!!expandedCategories[category.id]}
                onToggle={() => toggleCategoryExpansion(category.id)}
                onDragStart={(e) => handleCategoryDragStart(e, category.id)}
                onDragOver={handleCategoryDragOver}
                onDrop={(e) => handleCategoryDrop(e, category.id)}
              />
              
              {expandedCategories[category.id] && (
                <div className="mt-2 ml-4 pl-2 border-l-2 border-dashed border-gray-300 dark:border-gray-700">
                  <TaskList 
                    categoryId={category.id}
                    tasks={categoryTasks}
                  />
                </div>
              )}
            </div>
          );
        })}
        
        {(categories.length === 0 || (selectedDate && getFilteredTaskCount() === 0)) && (
          <div className="text-center p-10 retro-border bg-white/50 dark:bg-retro-navy/50 rounded-lg">
            {selectedDate ? (
              <>
                <CalendarIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="font-pixel text-lg mb-2 text-gray-700 dark:text-gray-300">No Tasks in This Month</h3>
                <p className="font-mono text-sm text-gray-500 dark:text-gray-400 mb-4">
                  There are no tasks scheduled for {format(selectedDate, "MMMM yyyy")}.
                </p>
                <Button
                  onClick={() => setSelectedDate(undefined)}
                  className="retro-btn"
                >
                  Clear Date Filter
                </Button>
              </>
            ) : (
              <>
                <FolderIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="font-pixel text-lg mb-2 text-gray-700 dark:text-gray-300">No Categories Yet</h3>
                <p className="font-mono text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Create your first category to start organizing your tasks!
                </p>
                <Button
                  onClick={() => setIsAddingCategory(true)}
                  className="retro-btn"
                >
                  <PlusCircle size={16} className="mr-1" />
                  Create Category
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
