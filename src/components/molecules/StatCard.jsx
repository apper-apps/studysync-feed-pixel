import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend,
  trendValue,
  color = "primary",
  description
}) => {
  const colorStyles = {
    primary: {
      bg: "bg-gradient-to-r from-primary-500 to-primary-600",
      icon: "text-primary-500 bg-primary-100",
      trend: "text-primary-600"
    },
    secondary: {
      bg: "bg-gradient-to-r from-secondary-500 to-secondary-600",
      icon: "text-secondary-500 bg-secondary-100",
      trend: "text-secondary-600"
    },
    accent: {
      bg: "bg-gradient-to-r from-accent-500 to-accent-600",
      icon: "text-accent-500 bg-accent-100",
      trend: "text-accent-600"
    },
    success: {
      bg: "bg-gradient-to-r from-green-500 to-green-600",
      icon: "text-green-500 bg-green-100",
      trend: "text-green-600"
    },
    warning: {
      bg: "bg-gradient-to-r from-yellow-500 to-yellow-600",
      icon: "text-yellow-500 bg-yellow-100",
      trend: "text-yellow-600"
    }
  };

  const styles = colorStyles[color];

  return (
    <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
          {trend && trendValue && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                className={`h-4 w-4 mr-1 ${trend === "up" ? "text-green-600" : "text-red-600"}`}
              />
              <span className={`text-sm font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        
        <div className={`w-12 h-12 rounded-xl ${styles.icon} flex items-center justify-center`}>
          <ApperIcon name={icon} className="h-6 w-6" />
        </div>
      </div>
      
      {/* Gradient accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${styles.bg}`}></div>
    </Card>
  );
};

export default StatCard;