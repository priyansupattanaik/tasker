
import React from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import * as icons from "lucide-react";

const Sidebar: React.FC = () => {
  const { categories } = useTaskContext();

  // Sort categories by position
  const sortedCategories = [...categories].sort((a, b) => a.position - b.position);

  // Get the icon component based on the icon name
  const getIconComponent = (iconName: string | undefined) => {
    const IconComponent = iconName ? (icons as any)[iconName] : icons.Folder;
    return IconComponent || icons.Folder;
  };

  return (
    <div className="w-full bg-white/80 dark:bg-retro-navy/80 backdrop-blur-sm p-4 retro-border">
      <h2 className="font-pixel text-sm mb-4">Categories</h2>
      
      <ul className="space-y-2">
        {sortedCategories.map((category) => {
          const IconComponent = getIconComponent(category.icon);
          
          return (
            <li key={category.id}>
              <a 
                href={`#category-${category.id}`}
                className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <IconComponent 
                  size={16} 
                  style={{ color: category.color }} 
                  className="mr-2" 
                />
                <span className="font-mono text-sm truncate">{category.name}</span>
              </a>
            </li>
          );
        })}
        
        {categories.length === 0 && (
          <li className="text-center p-4 text-sm text-gray-500 dark:text-gray-400 font-mono">
            No categories yet
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
