import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { format } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between p-4 bg-retro-purple text-white dark:bg-retro-navy dark:text-retro-green retro-border">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl md:text-2xl font-pixel animate-pulse-retro">
          Tasker
        </h1>
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden md:block">
          <div className="font-mono text-lg bg-black/20 dark:bg-retro-green/20 px-3 py-1 rounded">
            {format(currentTime, "MM/dd/yyyy hh:mm:ss a")}
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="bg-transparent border-2 border-white dark:border-retro-green hover:bg-white/10 dark:hover:bg-retro-green/10"
        >
          {theme === "light" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
