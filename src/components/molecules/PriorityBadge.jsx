import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const PriorityBadge = ({ priority = "medium", showIcon = true }) => {
  const priorityConfig = {
    high: {
      variant: "error",
      label: "High Priority",
      icon: "AlertCircle"
    },
    medium: {
      variant: "warning",
      label: "Medium Priority",
      icon: "Clock"
    },
    low: {
      variant: "info",
      label: "Low Priority",
      icon: "Minus"
    }
  };

  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <Badge variant={config.variant} size="sm" className="inline-flex items-center">
      {showIcon && (
        <ApperIcon name={config.icon} className="w-3 h-3 mr-1" />
      )}
      {config.label}
    </Badge>
  );
};

export default PriorityBadge;