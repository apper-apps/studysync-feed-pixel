import React from "react";
import { cn } from "@/utils/cn";

const CourseColorPicker = ({ selectedColor, onColorChange, className }) => {
  const colors = [
    { name: "Purple", value: "#8B5CF6", bg: "bg-purple-500" },
    { name: "Blue", value: "#3B82F6", bg: "bg-blue-500" },
    { name: "Green", value: "#10B981", bg: "bg-green-500" },
    { name: "Red", value: "#EF4444", bg: "bg-red-500" },
    { name: "Orange", value: "#F97316", bg: "bg-orange-500" },
    { name: "Pink", value: "#EC4899", bg: "bg-pink-500" },
    { name: "Teal", value: "#14B8A6", bg: "bg-teal-500" },
    { name: "Indigo", value: "#6366F1", bg: "bg-indigo-500" }
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-gray-700">
        Course Color
      </label>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onColorChange(color.value)}
            className={cn(
              "w-8 h-8 rounded-full border-2 transition-all duration-200",
              color.bg,
              selectedColor === color.value 
                ? "border-gray-900 scale-110 shadow-lg" 
                : "border-gray-300 hover:border-gray-400 hover:scale-105"
            )}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseColorPicker;