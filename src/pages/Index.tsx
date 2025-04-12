
import React from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TaskProvider } from "@/contexts/TaskContext";
import Header from "@/components/Header";
import CategoryList from "@/components/CategoryList";
import Sidebar from "@/components/Sidebar";
import { CircleIcon, SquareIcon, TriangleIcon, StarIcon, HeartIcon, ZapIcon } from "lucide-react";
import PriorityTaskAlert from "@/components/PriorityTaskAlert";

const Index = () => {
  return (
    <ThemeProvider>
      <TaskProvider>
        <div className="min-h-screen flex flex-col bg-retro-offwhite dark:bg-retro-navy relative">
          {/* Enhanced background elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-retro-purple/10 via-retro-teal/10 to-retro-pink/10"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(155,135,245,0.2),transparent_70%)]"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,rgba(30,174,219,0.15),transparent_70%)]"></div>
            
            {/* More background elements */}
            <CircleIcon className="absolute text-primary/15 animate-pulse-retro top-[20%] right-[10%] h-36 w-36" />
            <SquareIcon className="absolute text-secondary/15 animate-pulse-retro bottom-[30%] left-[5%] h-28 w-28" />
            <TriangleIcon className="absolute text-accent/15 animate-pulse-retro top-[70%] right-[15%] h-24 w-24" />
            <StarIcon className="absolute text-primary/15 animate-pulse-retro top-[10%] left-[15%] h-20 w-20" />
            <HeartIcon className="absolute text-pink-500/15 animate-pulse-retro bottom-[15%] right-[25%] h-24 w-24" />
            <ZapIcon className="absolute text-yellow-500/15 animate-pulse-retro top-[40%] left-[8%] h-20 w-20" />
            
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30 dark:opacity-10"></div>
          </div>
          
          {/* Dark mode adds a CRT overlay effect */}
          <div className="dark:crt-overlay"></div>
          
          <Header />
          
          <div className="flex flex-col md:flex-row flex-grow">
            {/* Sidebar for smaller screens */}
            <div className="md:hidden">
              <Sidebar />
            </div>
            
            {/* Sidebar for medium screens and up */}
            <div className="hidden md:block md:w-64 p-4">
              <Sidebar />
            </div>
            
            {/* Main content */}
            <div className="flex-grow overflow-y-auto relative">
              <CategoryList />
              
              {/* Priority Task Alert - Bottom Right */}
              <div className="fixed bottom-4 right-4 z-20">
                <PriorityTaskAlert />
              </div>
            </div>
          </div>
        </div>
      </TaskProvider>
    </ThemeProvider>
  );
};

export default Index;
