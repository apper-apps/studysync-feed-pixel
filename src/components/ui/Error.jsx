import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  error = "Something went wrong", 
  onRetry, 
  type = "default"
}) => {
  const getErrorIcon = () => {
    switch (type) {
      case "network":
        return "WifiOff";
      case "notfound":
        return "Search";
      case "permission":
        return "Lock";
      default:
        return "AlertCircle";
    }
  };

  const getErrorMessage = () => {
    switch (type) {
      case "network":
        return "Unable to connect. Please check your internet connection.";
      case "notfound":
        return "The requested information could not be found.";
      case "permission":
        return "You don't have permission to access this resource.";
      default:
        return error;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
      <div className="w-16 h-16 mb-6 text-accent-500 bg-accent-50 rounded-full flex items-center justify-center">
        <ApperIcon name={getErrorIcon()} size={32} />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {getErrorMessage()}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" size={16} />
          <span>Try Again</span>
        </button>
      )}
      
      <div className="mt-4 text-sm text-gray-500">
        If the problem persists, please contact support.
      </div>
    </div>
  );
};

export default Error;