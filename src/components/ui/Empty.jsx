import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "Nothing here yet", 
  message = "Get started by adding your first item", 
  actionText = "Add Item", 
  onAction,
  icon = "Plus",
  type = "default"
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "courses":
        return {
          icon: "BookOpen",
          title: "No courses added yet",
          message: "Start organizing your academic life by adding your first course",
          actionText: "Add Course"
        };
      case "assignments":
        return {
          icon: "FileText",
          title: "No assignments found",
          message: "Keep track of your tasks and deadlines by adding assignments",
          actionText: "Add Assignment"
        };
      case "schedule":
        return {
          icon: "Calendar",
          title: "No classes scheduled",
          message: "Build your weekly schedule by adding class times",
          actionText: "Add Class"
        };
      case "grades":
        return {
          icon: "Award",
          title: "No grades recorded",
          message: "Track your academic progress by adding grades",
          actionText: "Add Grade"
        };
      case "search":
        return {
          icon: "Search",
          title: "No results found",
          message: "Try adjusting your search terms or filters",
          actionText: "Clear Filters"
        };
      default:
        return { icon, title, message, actionText };
    }
  };

  const content = getEmptyContent();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-20 h-20 mb-6 text-primary-400 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl flex items-center justify-center">
        <ApperIcon name={content.icon} size={40} />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3 font-display">
        {content.title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {content.message}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="btn-primary flex items-center space-x-2 px-6 py-3 text-base"
        >
          <ApperIcon name={content.icon} size={18} />
          <span>{content.actionText}</span>
        </button>
      )}
      
      <div className="mt-8 flex items-center space-x-6 text-sm text-gray-400">
        <div className="flex items-center space-x-2">
          <ApperIcon name="Zap" size={16} />
          <span>Quick add</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Smartphone" size={16} />
          <span>Mobile friendly</span>
        </div>
        <div className="flex items-center space-x-2">
          <ApperIcon name="Clock" size={16} />
          <span>Real-time sync</span>
        </div>
      </div>
    </div>
  );
};

export default Empty;