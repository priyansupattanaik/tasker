
import React, { useState } from "react";
import * as icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
}

// Array of common icon names to display in the picker
const POPULAR_ICONS = [
  "Folder", "FileText", "CheckCircle", "Calendar", "Clock", 
  "Star", "Heart", "Home", "Settings", "Briefcase", 
  "ShoppingCart", "CreditCard", "Gift", "Trash2", "Send",
  "Mail", "Phone", "User", "Users", "Activity", 
  "AlertCircle", "Award", "Book", "Bookmark", "Camera",
  "Code", "Coffee", "Compass", "Database", "Globe",
  "Headphones", "Image", "Key", "Link", "Map",
  "MessageCircle", "Music", "Paperclip", "Pen", "Smile",
  "Tag", "Terminal", "Truck", "Umbrella", "Video",
  "Zap", "Cpu", "Framer", "Github", "Linkedin"
];

const IconPicker: React.FC<IconPickerProps> & { 
  getIconByName: (name: string) => React.ElementType | null 
} = ({ selectedIcon, onSelectIcon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectIcon = (iconName: string) => {
    onSelectIcon(iconName);
    setIsOpen(false);
  };

  // Get the icon component based on the icon name
  const IconComponent = React.useMemo(() => {
    return (icons as any)[selectedIcon] || icons.Folder;
  }, [selectedIcon]);

  // Filter icons based on search query
  const filteredIcons = searchQuery 
    ? Object.keys(icons).filter(
        name => name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 50) // Limit to 50 results for performance
    : POPULAR_ICONS;

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between retro-input"
          >
            <div className="flex items-center space-x-2">
              <IconComponent size={18} />
              <span className="font-mono">{selectedIcon}</span>
            </div>
            <span className="text-muted-foreground">↓</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 retro-card" align="start">
          <div className="p-2 border-b">
            <div className="flex items-center gap-2">
              <Search size={16} className="text-muted-foreground" />
              <Input
                placeholder="Search icons..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-8 focus-visible:ring-0 border-none"
              />
            </div>
          </div>

          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-5 p-2 gap-1">
              {filteredIcons.map(iconName => {
                const Icon = (icons as any)[iconName];
                if (!Icon) return null;
                
                return (
                  <Button
                    key={iconName}
                    variant="ghost"
                    size="icon"
                    className={`h-10 w-10 rounded ${selectedIcon === iconName ? 'bg-primary/20' : ''}`}
                    onClick={() => handleSelectIcon(iconName)}
                    title={iconName}
                  >
                    <Icon size={18} />
                  </Button>
                );
              })}
              
              {filteredIcons.length === 0 && (
                <div className="col-span-5 py-4 text-center text-sm text-muted-foreground">
                  No icons found
                </div>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Static method to get icon by name
IconPicker.getIconByName = (name: string): React.ElementType | null => {
  return (icons as any)[name] || null;
};

export default IconPicker;
