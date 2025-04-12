
import React, { useState } from "react";
import { Pencil, Trash2, ChevronDown, ChevronUp, Folder, MoreHorizontal } from "lucide-react";
import { Category, useTaskContext } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import IconPicker from "./IconPicker";

interface CategoryItemProps {
  category: Category;
  isExpanded: boolean;
  onToggle: () => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  isExpanded,
  onToggle,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const { updateCategory, deleteCategory } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(category.name);
  const [editedColor, setEditedColor] = useState(category.color);
  const [editedIcon, setEditedIcon] = useState(category.icon || "Folder");

  const handleSaveEdit = () => {
    if (editedName.trim()) {
      updateCategory(category.id, { 
        name: editedName.trim(),
        color: editedColor,
        icon: editedIcon
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(category.name);
    setEditedColor(category.color);
    setEditedIcon(category.icon || "Folder");
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete category "${category.name}" and all its tasks?`)) {
      deleteCategory(category.id);
    }
  };

  // Get the icon component based on the icon name
  const IconComponent = React.useMemo(() => {
    return IconPicker.getIconByName(category.icon || "Folder");
  }, [category.icon]);

  return (
    <div 
      className="mb-2 cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-category-id={category.id}
    >
      <div 
        className="flex items-center justify-between p-3 rounded retro-border"
        style={{ backgroundColor: category.color + "33" }}
      >
        <div className="flex items-center space-x-2">
          {IconComponent && 
            <IconComponent 
              size={18} 
              style={{ color: category.color }} 
              className="retro-icon" 
            />
          }
          <span className="font-mono text-base truncate">{category.name}</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                <Pencil size={15} />
              </Button>
            </DialogTrigger>
            <DialogContent className="retro-card dark:crt-overlay">
              <DialogHeader>
                <DialogTitle className="font-pixel text-base">Edit Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name" className="font-mono">Name</Label>
                  <Input 
                    id="category-name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="retro-input"
                    autoFocus
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category-icon" className="font-mono">Icon</Label>
                  <IconPicker 
                    selectedIcon={editedIcon} 
                    onSelectIcon={setEditedIcon} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category-color" className="font-mono">Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      id="category-color"
                      type="color"
                      value={editedColor}
                      onChange={(e) => setEditedColor(e.target.value)}
                      className="w-12 h-10"
                    />
                    <Input 
                      value={editedColor}
                      onChange={(e) => setEditedColor(e.target.value)}
                      className="retro-input"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={handleCancelEdit}
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
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <Trash2 size={15} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={onToggle}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryItem;
