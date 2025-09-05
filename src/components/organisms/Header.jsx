import React, { useContext } from "react";
import { toast } from 'react-toastify';
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { AuthContext } from "../../App";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      icon="LogOut"
      className="text-gray-600 hover:text-gray-900"
    >
      Logout
    </Button>
  );
};
const Header = ({ onMenuClick, title, subtitle, actions }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="md"
            icon="Menu"
            onClick={onMenuClick}
            className="lg:hidden mr-3"
          />
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

<div className="flex items-center space-x-3">
          {actions}
          <LogoutButton />
          
          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="md" icon="Bell" className="relative">
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-accent-500 rounded-full"></span>
            </Button>
          </div>

          {/* Quick Add */}
          <Button variant="primary" size="md" icon="Plus">
            <span className="hidden sm:inline">Quick Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;